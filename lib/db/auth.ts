"use server"

import { getDbClient } from "@/lib/supabase/db"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import type { AdminUser } from "./types"

const SESSION_COOKIE = "oakwood_admin_session"

export async function loginAdmin(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  try {
    const supabase = getDbClient()

    // Get admin user by email
    const { data: user, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single()

    if (error || !user) {
      return { success: false, error: "Invalid email or password" }
    }

    let isValidPassword = false

    // First try plain text comparison (for testing/development)
    if (password === user.password_hash) {
      isValidPassword = true
    } else {
      // Try bcrypt comparison (for production hashed passwords)
      try {
        isValidPassword = await bcrypt.compare(password, user.password_hash)
      } catch (bcryptError) {
        isValidPassword = false
      }
    }

    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password" }
    }

    // Create session
    const sessionToken = crypto.randomUUID()
    const cookieStore = await cookies()

    cookieStore.set(
      SESSION_COOKIE,
      JSON.stringify({
        token: sessionToken,
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      },
    )

    // Log login activity
    await supabase.from("activity_log").insert({
      action_type: "auth",
      action: "login",
      message: `Admin logged in: ${user.email}`,
      user_id: user.id,
      user_email: user.email,
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    }
  } catch (err) {
    return { success: false, error: "An error occurred during login" }
  }
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)

  if (session) {
    try {
      const sessionData = JSON.parse(session.value)
      const supabase = getDbClient()

      // Log logout activity
      await supabase.from("activity_log").insert({
        action_type: "auth",
        action: "logout",
        message: `Admin logged out: ${sessionData.email}`,
        user_id: sessionData.userId,
        user_email: sessionData.email,
      })
    } catch {
      // Ignore parsing errors
    }
  }

  cookieStore.delete(SESSION_COOKIE)
}

export async function getAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)

  if (!session) {
    return null
  }

  try {
    const sessionData = JSON.parse(session.value)
    return {
      id: sessionData.userId,
      email: sessionData.email,
      name: sessionData.name,
      role: sessionData.role,
      created_at: "",
      updated_at: "",
    }
  } catch {
    return null
  }
}

export async function createAdminUser(
  email: string,
  password: string,
  name: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getDbClient()

  // Check if email already exists
  const { data: existing } = await supabase.from("admin_users").select("id").eq("email", email.toLowerCase()).single()

  if (existing) {
    return { success: false, error: "Email already exists" }
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10)

  // Create user
  const { error } = await supabase.from("admin_users").insert({
    email: email.toLowerCase(),
    password_hash: passwordHash,
    name,
    role: "admin",
  })

  if (error) {
    return { success: false, error: "Failed to create admin user" }
  }

  return { success: true }
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(SESSION_COOKIE)

    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    const sessionData = JSON.parse(session.value)
    const supabase = getDbClient()

    // Get current user
    const { data: user, error } = await supabase.from("admin_users").select("*").eq("id", sessionData.userId).single()

    if (error || !user) {
      return { success: false, error: "User not found" }
    }

    // Verify current password
    let isValidPassword = false
    if (currentPassword === user.password_hash) {
      isValidPassword = true
    } else {
      try {
        isValidPassword = await bcrypt.compare(currentPassword, user.password_hash)
      } catch {
        isValidPassword = false
      }
    }

    if (!isValidPassword) {
      return { success: false, error: "Current password is incorrect" }
    }

    // Validate new password
    if (newPassword.length < 8) {
      return { success: false, error: "New password must be at least 8 characters" }
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10)

    // Update password
    const { error: updateError } = await supabase
      .from("admin_users")
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      return { success: false, error: "Failed to update password" }
    }

    // Log activity
    await supabase.from("activity_log").insert({
      action_type: "auth",
      action: "password_change",
      message: `Admin changed password: ${user.email}`,
      user_id: user.id,
      user_email: user.email,
    })

    return { success: true }
  } catch (err) {
    return { success: false, error: "An error occurred" }
  }
}
