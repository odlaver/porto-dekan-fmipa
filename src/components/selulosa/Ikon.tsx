import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { ukuran?: number }

const dasar = (ukuran = 48): SVGProps<SVGSVGElement> => ({
  width: ukuran,
  height: ukuran,
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
})

// Cincin glukosa: heksagon dengan oksigen cincin dan gugus OH
export function IkonGlukosa({ ukuran, ...p }: P) {
  return (
    <svg {...dasar(ukuran)} {...p}>
      <path d="M24 9 37 16.5v15L24 39 11 31.5v-15Z" />
      <circle cx="24" cy="9" r="2.2" fill="currentColor" />
      <path d="M37 16.5 43 13M11 31.5 5 35M37 31.5l6 3.5M24 39v6" />
    </svg>
  )
}

// Enzim mengikat substrat di sisi aktifnya
export function IkonEnzim({ ukuran, ...p }: P) {
  return (
    <svg {...dasar(ukuran)} {...p}>
      <path d="M33 13.5A15 15 0 1 0 33 34.5L24 24Z" />
      <path d="M36 18.5 42 22v6l-6 3.5-6-3.5v-6Z" />
      <circle cx="17" cy="20" r="1.4" fill="currentColor" />
    </svg>
  )
}

// Etanol dalam rumus garis: C, C, lalu OH
export function IkonEtanol({ ukuran, ...p }: P) {
  return (
    <svg {...dasar(ukuran)} {...p}>
      <path d="M6 32 17 25.5 28 32l9-5.2" />
      <circle cx="6" cy="32" r="1.6" fill="currentColor" />
      <circle cx="17" cy="25.5" r="1.6" fill="currentColor" />
      <circle cx="28" cy="32" r="1.6" fill="currentColor" />
      <text x="37.5" y="27.5" fontSize="9" fontFamily="inherit" fill="currentColor" stroke="none">
        OH
      </text>
    </svg>
  )
}

// Jaringan polimer yang saling bertaut silang
export function IkonHidrogel({ ukuran, ...p }: P) {
  return (
    <svg {...dasar(ukuran)} {...p}>
      <path d="M8 14c6 4 10-4 16 0s10 4 16 0M8 24c6 4 10-4 16 0s10 4 16 0M8 34c6 4 10-4 16 0s10 4 16 0" />
      <path d="M16 15.5v7.5M32 25.5v7.5M24 14v20" strokeDasharray="1.5 2.5" />
    </svg>
  )
}

export function ikonTema(nama: string) {
  if (/enzim/i.test(nama)) return IkonEnzim
  if (/etanol/i.test(nama)) return IkonEtanol
  if (/hidrogel/i.test(nama)) return IkonHidrogel
  return IkonGlukosa
}
