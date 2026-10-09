'use client'

import { ArrowLeft, ArrowRight } from '@phosphor-icons/react/dist/ssr'
import type React from 'react'
import { Children, useCallback, useEffect, useRef, useState } from 'react'
import s from './Carousel.module.css'

type Props = { label: string; children: React.ReactNode; lebar?: string }

export function Carousel({ label, children, lebar = '22rem' }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [awal, setAwal] = useState(true)
  const [akhir, setAkhir] = useState(false)
  const [progres, setProgres] = useState(0)
  const [posisi, setPosisi] = useState(1)
  const slides = Children.toArray(children)

  const perbarui = useCallback(() => {
    const t = trackRef.current
    if (!t) return
    const maks = t.scrollWidth - t.clientWidth
    setAwal(t.scrollLeft < 4)
    setAkhir(t.scrollLeft > maks - 4)
    setProgres(maks > 0 ? t.scrollLeft / maks : 1)
    const slide = t.querySelector<HTMLElement>('[data-slide]')
    if (slide) setPosisi(Math.min(slides.length, Math.round(t.scrollLeft / slide.offsetWidth) + 1))
  }, [slides.length])

  useEffect(() => {
    const t = trackRef.current
    if (!t) return
    // Ukur saat mendekati layar, agar bab yang di-skip tidak dipaksa layout
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        perbarui()
      },
      { rootMargin: '200px' },
    )
    io.observe(t)
    t.addEventListener('scroll', perbarui, { passive: true })
    window.addEventListener('resize', perbarui)
    return () => {
      io.disconnect()
      t.removeEventListener('scroll', perbarui)
      window.removeEventListener('resize', perbarui)
    }
  }, [perbarui])

  const geser = (arah: 1 | -1) => {
    const t = trackRef.current
    const slide = t?.querySelector<HTMLElement>('[data-slide]')
    if (!t || !slide) return
    const jarak = parseFloat(getComputedStyle(t.firstElementChild!).columnGap || '16')
    const halus = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    t.scrollBy({ left: arah * (slide.offsetWidth + jarak), behavior: halus ? 'smooth' : 'auto' })
  }

  const dua = (n: number) => String(n).padStart(2, '0')

  return (
    <section className={s.carousel} aria-roledescription="carousel" aria-label={label}>
      <div className={s.kontrol}>
        <span className={`mono ${s.hitung}`} aria-hidden="true">
          {dua(posisi)} / {dua(slides.length)}
        </span>
        <div className={s.progres} aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.max(0.04, progres)})` }} />
        </div>
        <button type="button" onClick={() => geser(-1)} disabled={awal} aria-label="Sebelumnya">
          <ArrowLeft size={18} weight="bold" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => geser(1)} disabled={akhir} aria-label="Berikutnya">
          <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </button>
      </div>

      <div ref={trackRef} className={s.track} tabIndex={0} role="region" aria-label={label}>
        <div className={s.isi} style={{ '--lebar': lebar } as React.CSSProperties}>
          {slides.map((anak, i) => (
            <div
              key={i}
              className={s.slide}
              data-slide
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} dari ${slides.length}`}
            >
              {anak}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
