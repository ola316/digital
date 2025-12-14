"use client"

import { useEffect, useState } from "react"

const AUTH_KEY = "oakwood-admin-session"
const AUTH_EVENT = "oakwood-auth-change"

export function isAuthedRaw() {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(AUTH_KEY) === "1"
}

export function useAdminAuth() {
  // Initialize from localStorage immediately to avoid false redirects on first render.
  const [isAuthed, setAuthed] = useState<boolean>(isAuthedRaw())

  useEffect(() => {
    const update = () => setAuthed(isAuthedRaw())
    const onStorage = (e: StorageEvent) => {
      if (e.key === AUTH_KEY) update()
    }

    // Sync across tabs and same-tab changes.
    window.addEventListener("storage", onStorage)
    window.addEventListener(AUTH_EVENT, update)

    // Ensure we sync once on mount.
    update()

    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener(AUTH_EVENT, update)
    }
  }, [])

  return { isAuthed, login, logout }
}

export function login(username: string, password: string) {
  const ok = username === "admin" && password === "oakwood2024"
  if (ok) {
    window.localStorage.setItem(AUTH_KEY, "1")
    // Notify same-tab listeners immediately.
    window.dispatchEvent(new Event(AUTH_EVENT))
  }
  return ok
}

export function logout() {
  window.localStorage.removeItem(AUTH_KEY)
  // Notify same-tab listeners immediately.
  window.dispatchEvent(new Event(AUTH_EVENT))
}
