'use client'

import { useEffect, useRef } from 'react'
import { muatGsap, saatInteraksi } from './gsap'
import s from './RantaiSelulosa.module.css'

const JUMLAH = 22
const JARAK = 84
const R = 26
const LEBAR = JUMLAH * JARAK + 40

// Sisi pemotongan enzim: setiap ikatan ketiga
const POTONG = (i: number) => i % 3 === 2

function heksagon(cx: number, cy: number) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k + Math.PI / 6
    return `${(cx + R * Math.cos(a)).toFixed(1)},${(cy + R * Math.sin(a)).toFixed(1)}`
  }).join(' ')
}

// Acak tetap agar server dan klien sama
const acak = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

export function RantaiSelulosa() {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current
    if (!svg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let ctx: { revert(): void } | undefined
    let batal = false
    // GSAP dimuat saat pengunjung mulai berinteraksi
    const lepas = saatInteraksi(() =>
      muatGsap().then((gsap) => {
        if (batal) return
        ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: svg, start: 'top 75%', end: 'bottom top', scrub: 0.8 },
          })
          // Rantai terurai: ikatan putus, unit glukosa terlepas
          tl.to('[data-ikatan-potong]', { opacity: 0, duration: 0.3 }, 0)
          svg.querySelectorAll<SVGGElement>('[data-unit]').forEach((g, i) => {
            tl.to(
              g,
              {
                x: (acak(i) - 0.5) * 80,
                y: (acak(i + 7) - 0.5) * 120,
                rotation: (acak(i + 3) - 0.5) * 120,
                svgOrigin: g.dataset.pusat,
                duration: 1,
              },
              0,
            )
          })
          tl.to('[data-lepas]', { fillOpacity: 1, duration: 0.6 }, 0.25)
        }, svg)
      }),
    )
    return () => {
      batal = true
      lepas()
      ctx?.revert()
    }
  }, [])

  const unit = Array.from({ length: JUMLAH }, (_, i) => ({
    cx: 40 + i * JARAK,
    cy: 120 + (i % 2 ? 16 : -16),
  }))

  // Ikatan digabung jadi beberapa path agar DOM ringan
  const garis = { utuh: '', potong: '' }
  const titik = { utuh: '', potong: '' }
  let gunting = ''
  unit.slice(0, -1).forEach((u, i) => {
    const n = unit[i + 1]
    const ox = (u.cx + n.cx) / 2
    const oy = (u.cy + n.cy) / 2 + (i % 2 ? -14 : 14)
    const k = POTONG(i) ? 'potong' : 'utuh'
    garis[k] += `M${u.cx + R * 0.87} ${u.cy}L${ox} ${oy}L${n.cx - R * 0.87} ${n.cy}`
    titik[k] += `M${ox - 2.6} ${oy}a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0 -5.2 0`
    if (POTONG(i)) gunting += `M${ox - 7} ${oy - 18}l14 10M${ox + 7} ${oy - 18}l-14 10`
  })

  return (
    <svg
      ref={ref}
      className={s.rantai}
      viewBox={`0 64 ${LEBAR} 132`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <path className={s.ikatan} d={garis.utuh} />
      <path className={s.titik} d={titik.utuh} />
      <g data-ikatan-potong="">
        <path className={s.ikatan} d={garis.potong} />
        <path className={s.titik} d={titik.potong} />
        <path className={s.gunting} d={gunting} />
      </g>
      {unit.map((u, i) => (
        <g key={`u${i}`} data-unit="" data-pusat={`${u.cx} ${u.cy}`}>
          <polygon
            points={heksagon(u.cx, u.cy)}
            className={s.cincin}
            {...(POTONG(i) || POTONG(i - 1) ? { 'data-lepas': '' } : {})}
          />
          <circle cx={u.cx} cy={u.cy - R} r="3" className={s.oksigen} />
          <line x1={u.cx} y1={u.cy + R} x2={u.cx} y2={u.cy + R + 12} className={s.gugus} />
        </g>
      ))}
    </svg>
  )
}
