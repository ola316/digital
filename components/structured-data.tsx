export function SchemaOrgJSON() {
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData),
      }}
      suppressHydrationWarning
    />
  )
}
