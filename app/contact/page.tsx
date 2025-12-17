"use client"

import type React from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { submitContactMessage } from "@/lib/db/contact-actions"
import { Mail, Phone, MapPin, Clock, CheckCircle2, Loader2, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [errors, setErrors] = useState<{ [k: string]: string }>({})

  const validate = () => {
    const e: { [k: string]: string } = {}
    if (!form.name.trim()) e.name = "Full name is required."
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email address."
    if (!form.message || form.message.trim().length < 10) e.message = "Message must be at least 10 characters."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return

    setStatus("loading")
    setErrorMessage("")

    const result = await submitContactMessage(form.name.trim(), form.email.trim(), form.message.trim())

    if (result.success) {
      setStatus("success")
      setForm({ name: "", email: "", message: "" })
    } else {
      setStatus("error")
      setErrorMessage(result.error || "Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      <Navigation />
      <main className="pt-28 pb-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about admissions, programs, or anything else? We&apos;re here to help and would love to
              hear from you.
            </p>
          </header>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Form - Takes 3 columns */}
            <div className="lg:col-span-3">
              <Card className="shadow-lg border-0 bg-card">
                <CardContent className="p-8">
                  {status === "success" ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-semibold text-foreground mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setStatus("idle")}
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={onSubmit} className="space-y-6" aria-label="Contact form">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "name-error" : undefined}
                          className={`h-12 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-emerald-500"}`}
                          disabled={status === "loading"}
                        />
                        {errors.name && (
                          <p id="name-error" className="text-sm text-red-500 flex items-center gap-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "email-error" : undefined}
                          className={`h-12 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-emerald-500"}`}
                          disabled={status === "loading"}
                        />
                        {errors.email && (
                          <p id="email-error" className="text-sm text-red-500">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-foreground">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          id="message"
                          placeholder="How can we help you?"
                          value={form.message}
                          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                          rows={6}
                          aria-invalid={!!errors.message}
                          aria-describedby={errors.message ? "message-error" : undefined}
                          className={`resize-none ${errors.message ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-emerald-500"}`}
                          disabled={status === "loading"}
                        />
                        {errors.message && (
                          <p id="message-error" className="text-sm text-red-500">
                            {errors.message}
                          </p>
                        )}
                      </div>

                      {status === "error" && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                        disabled={status === "loading"}
                      >
                        {status === "loading" ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Info - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* School Information */}
              <Card className="shadow-lg border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Address</p>
                        <p className="text-sm text-muted-foreground">123 Oak Street, Greenwood City, ST 12345</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Phone</p>
                        <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Email</p>
                        <p className="text-sm text-muted-foreground">info@oakwoodacademy.edu</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Office Hours</p>
                        <p className="text-sm text-muted-foreground">Monday – Friday: 8:00 AM – 5:00 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card className="shadow-lg border-0 bg-card overflow-hidden">
                <div className="h-48 bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">Interactive Map</p>
                  </div>
                </div>
              </Card>

              {/* Social Media */}
              <Card className="shadow-lg border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
