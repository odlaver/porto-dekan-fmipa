# Portofolio Dekan FMIPA Universitas Lampung

Situs portofolio Dr. Eng. Heri Satria, S.Si., M.Si. beserta panel admin untuk mengelola isinya.

## Teknologi

| Bagian | Teknologi |
| --- | --- |
| Bahasa | TypeScript, CSS Modules, SCSS (tema admin) |
| Framework | Next.js 16 (App Router, React Server Components, Turbopack), React 19 |
| CMS dan admin | Payload CMS 3 (menyatu di Next.js, admin di `/admin`, API REST dan GraphQL di `/api`), editor Lexical |
| Database | PostgreSQL lewat `@payloadcms/db-postgres` (Drizzle ORM, node-postgres) |
| Media | Vercel Blob lewat `@payloadcms/storage-vercel-blob`, folder `media` saat pengembangan lokal; olah gambar dengan `sharp` dan `next/image` |
| Animasi | GSAP + ScrollTrigger (dimuat saat ada interaksi), Lenis, IntersectionObserver, CSS scroll-driven animation |
| Font dan ikon | Geist, Geist Mono, Instrument Serif lewat `next/font`; Phosphor Icons dan ikon SVG buatan sendiri |
| Sinkron data | Scraper Google Scholar dan SINTA dengan Cheerio, dijalankan dari admin atau Payload Jobs |
| SEO | Metadata API Next.js, gambar OpenGraph dari `next/og`, `robots.txt`, `sitemap.xml` |
| Hosting | Vercel (region Singapura), Neon Postgres, Vercel Blob |
