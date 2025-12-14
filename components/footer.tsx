import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-gray-950">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-emerald-700 dark:text-emerald-300 font-semibold">Oakwood Academy</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Inspiring excellence and nurturing character since 1985.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-emerald-700 dark:hover:text-emerald-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-emerald-700 dark:hover:text-emerald-300">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-emerald-700 dark:hover:text-emerald-300">
                  Announcements
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-emerald-700 dark:hover:text-emerald-300">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-700 dark:hover:text-emerald-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>123 Oak Street, Greenwood City</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: info@oakwoodacademy.edu</li>
              <li>Office Hours: Mon-Fri 8:00 - 17:00</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Follow Us</h4>
            <div className="flex gap-3">
              <Link
                aria-label="Twitter"
                href="#"
                className="p-2 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                aria-label="Facebook"
                href="#"
                className="p-2 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                aria-label="Instagram"
                href="#"
                className="p-2 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                aria-label="YouTube"
                href="#"
                className="p-2 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300"
              >
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 items-center justify-between">
          <p>© {new Date().getFullYear()} Oakwood Academy. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
