'use client'

import type Lenis from 'lenis'
import { useEffect } from 'react'
import { renderPenuh, tataLetakTenang } from './gsap'

const PILIH = '[data-muncul], [data-muncul-baris]'

// Satu pengamat untuk semua reveal, plus scroll halus Lenis
export function Pengamat() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entri) =>
        entri.forEach((e) => {
          if (!e.isIntersecting) return
          ;(e.target as HTMLElement).dataset.terlihat = ''
          io.unobserve(e.target)
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    document.documentElement.dataset.siap = ''
    const amati = (akar: ParentNode) => akar.querySelectorAll(PILIH).forEach((el) => io.observe(el))
    amati(document)

    // Konten yang muncul belakangan (filter, tampilkan lainnya)
    const mo = new MutationObserver((ubah) =>
      ubah.forEach((u) =>
        u.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return
          if (n.matches(PILIH)) io.observe(n)
          amati(n)
        }),
      ),
    )
    mo.observe(document.body, { childList: true, subtree: true })

    const gerak = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis: Lenis | undefined
    let batal = false
    // Lenis hanya untuk mouse/trackpad, dimuat saat browser senggang
    const idle = window.requestIdleCallback ?? ((f: () => void) => setTimeout(f, 1))
    const tunggu =
      gerak && window.matchMedia('(pointer: fine)').matches
        ? idle(() =>
            import('lenis').then(({ default: L }) => {
              if (!batal) lenis = new L({ autoRaf: true, lerp: 0.11 })
            }),
          )
        : undefined

    // Bab mendarat di tepi atas; header menumpang di atas padding bab itu sendiri
    const onKlik = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      const hash = a?.getAttribute('href')
      const tujuan = hash && hash.length > 1 && document.querySelector<HTMLElement>(hash)
      if (!a || !tujuan || e.metaKey || e.ctrlKey || e.shiftKey) return
      e.preventDefault()
      renderPenuh()
      const offset = tujuan.matches('[data-nada]') ? 0 : 72
      const sisa = () => tujuan.getBoundingClientRect().top - offset
      // Ukur setelah pin GSAP (dipicu klik yang sama) selesai terpasang
      tataLetakTenang().then(() => gulirKe(tujuan, hash, sisa))
    }
    const gulirKe = (tujuan: HTMLElement, hash: string, sisa: () => number) => {
      const y = sisa() + window.scrollY
      if (lenis) {
        const l = lenis
        let dikoreksi = false
        // Pin GSAP bisa terpasang di tengah jalan; sekali koreksi cukup
        const tiba = () => {
          if (!dikoreksi && Math.abs(sisa()) > 2) {
            dikoreksi = true
            l.scrollTo(window.scrollY + sisa(), { onComplete: tiba })
          } else history.replaceState(null, '', hash)
        }
        l.scrollTo(y, { onComplete: tiba })
      } else {
        window.scrollTo({ top: y, behavior: gerak ? 'smooth' : 'instant' })
        history.replaceState(null, '', hash)
        // Koreksi sekali bila pin GSAP terpasang selama menggulir
        const henti = new AbortController()
        window.addEventListener(
          'scrollend',
          () => {
            henti.abort()
            if (Math.abs(sisa()) > 2) window.scrollBy({ top: sisa(), behavior: 'instant' })
          },
          { signal: henti.signal },
        )
        setTimeout(() => henti.abort(), 3000)
      }
    }
    document.addEventListener('click', onKlik)

    return () => {
      io.disconnect()
      mo.disconnect()
      batal = true
      if (tunggu !== undefined) (window.cancelIdleCallback ?? clearTimeout)(tunggu)
      document.removeEventListener('click', onKlik)
      lenis?.destroy()
    }
  }, [])

  return null
}
