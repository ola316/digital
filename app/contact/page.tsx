"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "success">("idle")
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [errors, setErrors] = useState<{ [k: string]: string }>({})

  const validate = () => {
    const e: { [k: string]: string } = {}
    if (!form.name) e.name = "Name is required."
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email is required."
    if (!form.message || form.message.length < 10) e.message = "Message must be at least 10 characters."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setStatus("success")
    setTimeout(() => setStatus("idle"), 3000)
    setForm({ name: "", email: "", message: "" })
  }

  return (
    <div className="min-h-[100dvh]">
      <Navigation />
      <main className="pt-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <header>
            <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
            <p className="text-muted-foreground">We&apos;d love to hear from you.</p>
          </header>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={onSubmit} className="space-y-4" aria-label="Contact form">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      aria-invalid={!!errors.name}
                      aria-describedby="name-error"
                    />
                    {errors.name && (
                      <p id="name-error" className="text-xs text-red-600 mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      aria-invalid={!!errors.email}
                      aria-describedby="email-error"
                    />
                    {errors.email && (
                      <p id="email-error" className="text-xs text-red-600 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      rows={5}
                      aria-invalid={!!errors.message}
                      aria-describedby="message-error"
                    />
                    {errors.message && (
                      <p id="message-error" className="text-xs text-red-600 mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700" type="submit">
                    Send Message
                  </Button>
                  {status === "success" && (
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      Thanks! We will get back to you soon.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="rounded-lg border p-4 bg-white dark:bg-gray-900">
                <h3 className="font-semibold">School Information</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  123 Oak Street, Greenwood City, ST 12345
                  <br />
                  Phone: (555) 123-4567
                  <br />
                  Email: info@oakwoodacademy.edu
                </p>
                <p className="text-sm text-muted-foreground mt-2">Office Hours: Monday–Friday, 8:00–17:00</p>
              </div>
              <div className="rounded-lg border p-4 bg-white dark:bg-gray-900">
                <h3 className="font-semibold">Map</h3>
                <div className="mt-2 h-64 rounded-md bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                  {"Map placeholder"}
                </div>
              </div>
              <div className="rounded-lg border p-4 bg-white dark:bg-gray-900">
                <h3 className="font-semibold">Follow Us</h3>
                <p className="text-sm text-muted-foreground mt-2">Twitter, Facebook, Instagram, and YouTube</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
