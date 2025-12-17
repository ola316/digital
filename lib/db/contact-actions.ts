"use server"

import { getDbClient } from "@/lib/supabase/db"

export interface ContactMessage {
  id: number
  full_name: string
  email: string
  message: string
  is_read: boolean
  created_at: string
  read_at: string | null
}

export async function submitContactMessage(
  fullName: string,
  email: string,
  message: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getDbClient()

    const { error } = await supabase.from("contact_messages").insert({
      full_name: fullName,
      email: email,
      message: message,
      is_read: false,
    })

    if (error) {
      console.error("[v0] Contact message insert error:", error)
      return { success: false, error: "Failed to submit message. Please try again." }
    }

    return { success: true }
  } catch (err) {
    console.error("[v0] Contact message error:", err)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const supabase = getDbClient()

    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Get contact messages error:", error)
      return []
    }

    return data || []
  } catch (err) {
    console.error("[v0] Get contact messages error:", err)
    return []
  }
}

export async function markMessageAsRead(id: number): Promise<{ success: boolean }> {
  try {
    const supabase = getDbClient()

    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      console.error("[v0] Mark message read error:", error)
      return { success: false }
    }

    return { success: true }
  } catch (err) {
    console.error("[v0] Mark message read error:", err)
    return { success: false }
  }
}

export async function deleteContactMessages(ids: number[]): Promise<{ success: boolean }> {
  try {
    const supabase = getDbClient()

    const { error } = await supabase.from("contact_messages").delete().in("id", ids)

    if (error) {
      console.error("[v0] Delete contact messages error:", error)
      return { success: false }
    }

    return { success: true }
  } catch (err) {
    console.error("[v0] Delete contact messages error:", err)
    return { success: false }
  }
}

export async function getUnreadMessageCount(): Promise<number> {
  try {
    const supabase = getDbClient()

    const { count, error } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false)

    if (error) {
      console.error("[v0] Get unread count error:", error)
      return 0
    }

    return count || 0
  } catch (err) {
    console.error("[v0] Get unread count error:", err)
    return 0
  }
}
