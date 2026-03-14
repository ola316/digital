import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Oakwood Academy | Inspiring Excellence, Nurturing Character",
    template: "%s | Oakwood Academy",
  },
  description:
    "Oakwood Academy is a premier educational institution dedicated to inspiring excellence and nurturing character. We offer comprehensive academic programs, sports, arts, and extracurricular activities for students of all ages.",
  keywords: [
    "Oakwood Academy",
    "school",
    "education",
    "academy",
    "learning",
    "students",
    "academic excellence",
    "character development",
    "private school",
    "quality education",
  ],
  authors: [{ name: "Oakwood Academy" }],
  creator: "Oakwood Academy",
  publisher: "Oakwood Academy",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Oakwood Academy",
    title: "Oakwood Academy | Inspiring Excellence, Nurturing Character",
    description:
      "Oakwood Academy is a premier educational institution dedicated to inspiring excellence and nurturing character.",
    images: [
      {
        url: "/oakwood-academy-school-campus.jpg",
        width: 1200,
        height: 630,
        alt: "Oakwood Academy Campus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oakwood Academy | Inspiring Excellence, Nurturing Character",
    description:
      "Oakwood Academy is a premier educational institution dedicated to inspiring excellence and nurturing character.",
    images: ["/oakwood-academy-school-campus.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  category: "education",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#059669" },
    { media: "(prefers-color-scheme: dark)", color: "#064e3b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
