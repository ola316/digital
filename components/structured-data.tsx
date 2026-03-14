'use client'

import { useEffect } from 'react'

export function SchemaOrgJSON() {
  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "Oakwood Academy",
      description:
        "A premier educational institution dedicated to inspiring excellence and nurturing character.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "123 Education Lane",
        addressLocality: "Springfield",
        addressRegion: "State",
        postalCode: "12345",
        addressCountry: "US",
      },
      telephone: "+1-555-123-4567",
      email: "info@oakwoodacademy.edu",
      sameAs: [],
    }

    // Create and inject the script tag
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schemaData)
    document.head.appendChild(script)

    // Cleanup function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  // Return null since we're injecting the script directly into the DOM
  return null
}
