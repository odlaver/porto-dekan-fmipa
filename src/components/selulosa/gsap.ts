import type { gsap as Gsap } from 'gsap'

let janji: Promise<typeof Gsap> | undefined

// GSAP + ScrollTrigger dimuat terpisah dari bundel awal
export function muatGsap() {
  janji ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger)
    return g.gsap
  })
  return janji
}

const PEMICU = ['scroll', 'wheel', 'touchstart', 'keydown', 'pointerdown'] as const

// Jalankan sekali saat pengunjung mulai berinteraksi
export function saatInteraksi(f: () => void) {
  const lepas = () => PEMICU.forEach((e) => window.removeEventListener(e, jalan))
  const jalan = () => {
    lepas()
    f()
  }
  PEMICU.forEach((e) => window.addEventListener(e, jalan, { passive: true }))
  return lepas
}

const antrean = new Set<Promise<unknown>>()

// Catat perubahan tata letak yang sedang berjalan, mis. pin GSAP
export function tandaiTataLetak(p: Promise<unknown>) {
  const hapus = () => antrean.delete(p)
  antrean.add(p)
  p.then(hapus, hapus)
}

// Tunggu tata letak tenang, paling lama 800 ms
export const tataLetakTenang = () =>
  Promise.race([Promise.all(antrean), new Promise((r) => setTimeout(r, 800))])

// Bab yang masih di-skip content-visibility dirender penuh sebelum diukur
export function renderPenuh() {
  document.documentElement.dataset.ukur = ''
}
