'use client'

import { useEffect, useRef, useState } from 'react'
import type { RoadmapKlien, TemaKlien } from '@/lib/klien'
import { Carousel } from './Carousel'
import { muatGsap, renderPenuh, saatInteraksi, tandaiTataLetak } from './gsap'
import { ikonTema } from './Ikon'
import s from './Roadmap.module.css'

function Kartu({ r, redup }: { r: RoadmapKlien; redup: boolean }) {
  const t = r.tema
  const Ikon = ikonTema(t?.nama ?? '')
  return (
    <article className={s.kartu} data-redup={redup} data-rencana={Boolean(r.rencana)}>
      <div className={s.kartuAtas}>
        <span className={s.tahun}>{r.tahun}</span>
        <Ikon ukuran={34} className={s.ikon} />
      </div>
      {t && <p className={`mono ${s.tema}`}>{t.nama}</p>}
      <h3 className={s.judul}>{r.judul}</h3>
      {(r.jenis || r.keterangan) && (
        <p className={`mono ${s.meta}`}>{[r.jenis, r.keterangan].filter(Boolean).join(' · ')}</p>
      )}
    </article>
  )
}

// Layar lebar: bab di-pin dan lini masa bergeser mengikuti gulir
function Pan({ roadmap, pilih }: { roadmap: RoadmapKlien[]; pilih: number | 'semua' }) {
  const panRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const pan = panRef.current
    const track = trackRef.current
    if (!pan || !track) return
    const jarak = () => Math.max(0, track.scrollWidth - pan.clientWidth)
    let ctx: { revert(): void } | undefined
    let batal = false
    // Pin dibuat saat interaksi pertama, setelah semua bab punya tinggi nyata
    const lepas = saatInteraksi(() => {
      renderPenuh()
      const pasang = muatGsap().then((gsap) => {
        if (batal) return
        ctx = gsap.context(() => {
          gsap.to(track, {
            x: () => -jarak(),
            ease: 'none',
            scrollTrigger: {
              trigger: pan,
              start: 'center center',
              end: () => `+=${jarak()}`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: (st) => track.style.setProperty('--progres', String(st.progress)),
            },
          })
        }, pan)
      })
      tandaiTataLetak(pasang)
    })
    return () => {
      batal = true
      lepas()
      ctx?.revert()
    }
  }, [roadmap])

  return (
    <div ref={panRef} className={s.pan}>
      <div ref={trackRef} className={s.track}>
        {roadmap.map((r) => (
          <div key={r.id} className={s.slide}>
            <span className={s.simpul} aria-hidden="true" />
            <Kartu r={r} redup={pilih !== 'semua' && r.tema?.id !== pilih} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function Roadmap({ tema, roadmap }: { tema: TemaKlien[]; roadmap: RoadmapKlien[] }) {
  const [pilih, setPilih] = useState<number | 'semua'>('semua')
  const [pan, setPan] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(
      '(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    )
    const ubah = () => setPan(mq.matches)
    ubah()
    mq.addEventListener('change', ubah)
    return () => mq.removeEventListener('change', ubah)
  }, [])

  if (!roadmap.length) return <p className={s.kosong}>Roadmap belum diisi di admin.</p>

  const daftar = roadmap.filter((r) => pilih === 'semua' || r.tema?.id === pilih)

  return (
    <div>
      <div role="group" aria-label="Tema riset" className={s.saring}>
        <button type="button" aria-pressed={pilih === 'semua'} onClick={() => setPilih('semua')}>
          Semua <span>{roadmap.length}</span>
        </button>
        {tema.map((t) => {
          const Ikon = ikonTema(t.nama)
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={pilih === t.id}
              onClick={() => setPilih(t.id)}
            >
              <Ikon ukuran={22} />
              {t.nama}
              <span>{roadmap.filter((r) => r.tema?.id === t.id).length}</span>
            </button>
          )
        })}
      </div>

      {pan ? (
        <Pan roadmap={roadmap} pilih={pilih} />
      ) : (
        <Carousel key={String(pilih)} label="Roadmap penelitian" lebar="20rem">
          {daftar.map((r) => (
            <Kartu key={r.id} r={r} redup={false} />
          ))}
        </Carousel>
      )}
    </div>
  )
}
