"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { loginAdmin } from "@/lib/db/auth"

export default function AdminLoginPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await loginAdmin(form.email, form.password)
      if (result.success) {
        router.replace("/admin")
      } else {
        setError(result.error || "Invalid credentials")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[100dvh]">
      <Navigation />
      <main className="pt-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="min-h-[60vh] grid place-items-center">
            <form
              onSubmit={onSubmit}
              className="w-full max-w-md rounded-xl border p-6 bg-white dark:bg-gray-900 shadow-sm"
            >
              <h1 className="text-2xl font-semibold text-center">Admin Login</h1>
              <div className="mt-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <p className="text-xs text-emerald-700 dark:text-emerald-300 text-center font-medium">
                  Default Credentials:
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center mt-1">
                  Email: <span className="font-mono font-bold">admin@oakwood.edu</span>
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center">
                  Password: <span className="font-mono font-bold">admin123</span>
                </p>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="admin@oakwood.edu"
                    autoFocus
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="admin123"
                    disabled={isSubmitting}
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
