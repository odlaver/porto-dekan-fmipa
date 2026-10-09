import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import type React from 'react'
import type { Data } from '@/lib/data'
import type { Publikasi } from '@/payload-types'
import { hurufJudul } from '@/seed/rapikan'
import { ikonTema } from './Ikon'
import s from './Fokus.module.css'

const sitasi = (p: Publikasi) => Math.max(p.sitasiScholar ?? 0, p.sitasiScopus ?? 0)

// Karya tema dicocokkan dari kata kunci judul, lalu yang paling disitasi
function karyaTema(kataKunci: string | null | undefined, publikasi: Publikasi[]) {
  const kunci = (kataKunci ?? '')
    .split(',')
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean)
  if (!kunci.length) return []
  return publikasi
    .filter((p) => kunci.some((k) => p.judul.toLowerCase().includes(k)))
    .sort((a, b) => sitasi(b) - sitasi(a) || (b.tahun ?? 0) - (a.tahun ?? 0))
    .filter(
      (p, i, arr) => arr.findIndex((q) => q.kunci?.slice(0, 40) === p.kunci?.slice(0, 40)) === i,
    )
    .slice(0, 3)
}

export function Fokus({ tema, publikasi, roadmap }: Pick<Data, 'tema' | 'publikasi' | 'roadmap'>) {
  if (!tema.length) {
    return <p className={s.kosong}>Tema riset belum diisi di admin.</p>
  }

  return (
    <ol className={s.grid}>
      {tema.map((t, i) => {
        const Ikon = ikonTema(t.nama)
        const tahun = roadmap
          .filter((r) => (typeof r.tema === 'object' ? r.tema?.id : r.tema) === t.id)
          .map((r) => r.tahun)
        const rentang = tahun.length ? `${Math.min(...tahun)}–${Math.max(...tahun)}` : null
        const karya = karyaTema(t.kataKunci, publikasi)

        return (
          <li
            key={t.id}
            className={s.kolom}
            data-muncul=""
            style={{ '--i': i } as React.CSSProperties}
          >
            <div className={s.atas}>
              <span className="mono">{String.fromCharCode(65 + i)}</span>
              {rentang && <span className="mono">{rentang}</span>}
            </div>
            <Ikon ukuran={84} className={s.ikon} />
            <h3 className={s.nama}>{t.nama}</h3>
            {t.deskripsi && <p className={s.deskripsi}>{t.deskripsi}</p>}

            {karya.length > 0 && (
              <div className={s.karya}>
                <h4 className="mono">Publikasi utama</h4>
                <ul>
                  {karya.map((p) => {
                    const isi = (
                      <>
                        <span className={s.judul}>{p.judul}</span>
                        <span className={s.meta}>
                          {p.venue && <span>{hurufJudul(p.venue).replace(/\s+\d.*$/, '')}</span>}
                          <span>
                            {[p.tahun, sitasi(p) > 0 && `${sitasi(p)} sitasi`]
                              .filter(Boolean)
                              .join(' · ')}
                          </span>
                        </span>
                      </>
                    )
                    return (
                      <li key={p.id}>
                        {p.tautan ? (
                          <a
                            href={p.tautan}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={s.tautan}
                          >
                            {isi}
                            <ArrowUpRight
                              className={s.panah}
                              size={15}
                              weight="bold"
                              aria-hidden="true"
                            />
                          </a>
                        ) : (
                          <div className={s.tautan}>{isi}</div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
