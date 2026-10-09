import type { Metadata } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import React from 'react'
import 'lenis/dist/lenis.css'
import { Pengamat } from '@/components/selulosa/Pengamat'
import './styles.css'

const sans = Geist({ variable: '--font-geist', subsets: ['latin'] })
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
// Hanya gaya italic yang dipakai .aksen
const aksen = Instrument_Serif({
  variable: '--font-instrument',
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3210'),
  openGraph: {
    type: 'profile',
    locale: 'id_ID',
    title: 'Dr. Eng. Heri Satria, S.Si., M.Si.',
    description: 'Dekan FMIPA Universitas Lampung: riset, publikasi, pengabdian, dan kegiatan.',
  },
  title: 'Heri Satria, Dekan FMIPA Universitas Lampung',
  alternates: { canonical: '/' },
  description:
    'Portofolio Dekan FMIPA Universitas Lampung: riwayat pendidikan, roadmap penelitian, publikasi, pengabdian, pengalaman mengajar, dan kegiatan.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${sans.variable} ${mono.variable} ${aksen.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#0c1a14" />
        {/* Tandai JS aktif sebelum cat pertama agar reveal tidak berkedip */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js=''" }} />
      </head>
      <body>
        <Pengamat />
        <a className="skip" href="#isi">
          Langsung ke isi
        </a>
        {children}
      </body>
    </html>
  )
}
