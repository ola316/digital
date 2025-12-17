"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { loginAdmin } from "@/lib/db/auth"
import { Lock } from "lucide-react"

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
              <div className="flex flex-col items-center gap-2 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h1 className="text-2xl font-semibold text-center">Admin Login</h1>
                <p className="text-sm text-muted-foreground text-center">
                  Enter your credentials to access the dashboard
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="Enter your email"
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
                    placeholder="Enter your password"
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
