'use client'

import { useEffect, useRef } from 'react'
import s from './TeksIsi.module.css'

// Kata terisi warna penuh mengikuti posisi gulir
export function TeksIsi({ teks }: { teks: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const kata = teks.split(/\s+/)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const spans = [...el.querySelectorAll<HTMLSpanElement>('span')]
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.dataset.live = 'true'
    let frame = 0
    const perbarui = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.3)
      const batas = Math.round(Math.min(1, Math.max(0, p)) * spans.length)
      spans.forEach((sp, i) => sp.toggleAttribute('data-isi', i < batas))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(perbarui)
    }
    // Ikuti gulir hanya saat paragraf dekat layar
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          perbarui()
          window.addEventListener('scroll', onScroll, { passive: true })
        } else window.removeEventListener('scroll', onScroll)
      },
      { rootMargin: '30% 0px' },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <p ref={ref} className={s.teks}>
      {kata.map((k, i) => (
        <span key={i}>{k} </span>
      ))}
    </p>
  )
}
