// Centralised Marclie CMS branding. Keep all brand strings/admin identity here so
// rebranding a project touches one file. The engine core stays untouched.

export const brandName = 'Marclie CMS'

export const brandDescription = 'Content management for the Marclie marketing site.'

// Wired into payload.config `admin.meta`. Controls the admin browser tab title,
// favicon, and default Open Graph metadata.
export const adminMeta = {
  title: brandName,
  titleSuffix: `— ${brandName}`,
  description: brandDescription,
  icons: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      url: '/favicon.svg',
    },
  ],
  openGraph: {
    title: brandName,
    description: brandDescription,
  },
}
