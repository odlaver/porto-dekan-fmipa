'use client'

import { ArrowDownRight } from '@phosphor-icons/react/dist/ssr'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import s from './Header.module.css'

const TAUTAN = [
  ['#profil', 'Profil'],
  ['#fokus', 'Riset'],
  ['#hibah', 'Hibah'],
  ['#publikasi', 'Publikasi'],
  ['#mengajar', 'Mengajar'],
  ['#kegiatan', 'Kegiatan'],
] as const

const ALIAS: Record<string, string> = { '#roadmap': '#fokus' }

// Label ganda untuk efek gulung saat hover
function Gulung({ teks }: { teks: string }) {
  return (
    <span className={s.gulung}>
      <span>{teks}</span>
      <span aria-hidden="true">{teks}</span>
    </span>
  )
}

export function Header({ nama }: { nama: string }) {
  const [buka, setBuka] = useState(false)
  const [aktif, setAktif] = useState('')
  const [gelap, setGelap] = useState(true)
  const [atas, setAtas] = useState(true)
  const progres = useRef<HTMLSpanElement>(null)
  const rel = useRef<HTMLUListElement>(null)

  useEffect(() => {
    // Warna header mengikuti bab di garis 4% layar
    const bab = [...document.querySelectorAll<HTMLElement>('[data-nada]')]
    const cekNada = () => {
      const y = window.innerHeight * 0.04
      const kena = bab.find((el) => {
        const r = el.getBoundingClientRect()
        return r.top <= y && r.bottom > y
      })
      if (kena) setGelap(kena.dataset.nada === 'gelap')
    }
    const pita = new IntersectionObserver(cekNada, { rootMargin: '-4% 0px -95.9% 0px' })
    bab.forEach((el) => pita.observe(el))
    cekNada()

    const io = new IntersectionObserver(
      (entri) =>
        entri.forEach((e) => {
          if (!e.isIntersecting) return
          const id = `#${e.target.id}`
          setAktif(ALIAS[id] ?? id)
        }),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ;[...TAUTAN.map(([h]) => h), ...Object.keys(ALIAS), '#kontak'].forEach((h) => {
      const el = document.querySelector(h)
      if (el) io.observe(el)
    })
    return () => {
      pita.disconnect()
      io.disconnect()
    }
  }, [])

  useEffect(() => {
    // Latar header muncul setelah mulai digulir
    const pakaiCss = CSS.supports('animation-timeline: scroll()')
    let raf = 0
    const ukur = () => {
      raf = 0
      setAtas(window.scrollY < 8)
      if (pakaiCss) return
      const maks = document.documentElement.scrollHeight - window.innerHeight
      progres.current?.style.setProperty(
        'transform',
        `scaleX(${maks > 0 ? window.scrollY / maks : 0})`,
      )
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(ukur)
    }
    ukur()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    // Penanda aktif bergeser ke tautan bab
    const ul = rel.current
    if (!ul) return
    const posisikan = () => {
      const a = ul.querySelector<HTMLElement>('a[aria-current]')
      ul.dataset.penanda = a ? 'ada' : ''
      if (!a) return
      ul.style.setProperty('--x', `${a.offsetLeft}px`)
      ul.style.setProperty('--w', `${a.offsetWidth}px`)
    }
    posisikan()
    window.addEventListener('resize', posisikan)
    return () => window.removeEventListener('resize', posisikan)
  }, [aktif])

  useEffect(() => {
    if (!buka) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setBuka(false)
    window.addEventListener('keydown', onKey)
    document.documentElement.dataset.menu = ''
    return () => {
      window.removeEventListener('keydown', onKey)
      delete document.documentElement.dataset.menu
    }
  }, [buka])

  const inisial = nama
    .split(' ')
    .map((k) => k[0])
    .join('')

  return (
    <header
      className={s.header}
      data-gelap={gelap || buka}
      data-atas={atas && !buka}
      data-buka={buka}
    >
      <div className={`wrap ${s.bar}`}>
        <a href="#isi" className={s.merek}>
          <span className={s.monogram} aria-hidden="true">
            <svg viewBox="0 0 40 40">
              <polygon points="20,1.5 36,10.75 36,29.25 20,38.5 4,29.25 4,10.75" />
            </svg>
            <span>{inisial}</span>
          </span>
          <span className={s.teksMerek}>
            <span className={s.nama}>{nama}</span>
            <span className={`mono ${s.jabatan}`}>Dekan FMIPA Unila</span>
          </span>
        </a>

        <button
          type="button"
          className={s.menu}
          aria-expanded={buka}
          aria-controls="navigasi"
          onClick={() => setBuka((b) => !b)}
        >
          <span className={s.garisMenu} aria-hidden="true" />
          {buka ? 'Tutup' : 'Menu'}
        </button>

        <nav id="navigasi" className={s.nav} aria-label="Bab halaman">
          <ul ref={rel}>
            {TAUTAN.map(([href, label], i) => (
              <li key={href} style={{ '--i': i } as React.CSSProperties}>
                <a
                  href={href}
                  aria-current={aktif === href ? 'location' : undefined}
                  onClick={() => setBuka(false)}
                >
                  <Gulung teks={label} />
                </a>
              </li>
            ))}
          </ul>
          <a href="#kontak" className={s.kontak} onClick={() => setBuka(false)}>
            <Gulung teks="Kontak" />
            <ArrowDownRight size={14} weight="bold" aria-hidden="true" />
          </a>
        </nav>
      </div>
      <span ref={progres} className={s.progres} aria-hidden="true" />
    </header>
  )
}
