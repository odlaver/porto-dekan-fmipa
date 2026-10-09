import type { MetadataRoute } from 'next'

const situs = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3210'

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${situs}/`, changeFrequency: 'weekly', priority: 1 }]
}
