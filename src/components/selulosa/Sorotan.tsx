import type { Publikasi } from '@/payload-types'
import { hurufJudul } from '@/seed/rapikan'
import s from './Sorotan.module.css'

const sitasi = (p: Publikasi) => Math.max(p.sitasiScholar ?? 0, p.sitasiScopus ?? 0)

// Tiga karya paling banyak disitasi; yang teratas paling besar
export function Sorotan({ publikasi }: { publikasi: Publikasi[] }) {
  const teratas = [...publikasi]
    .filter((p) => sitasi(p) > 0)
    .sort((a, b) => sitasi(b) - sitasi(a))
    .filter(
      (p, i, arr) => arr.findIndex((q) => q.kunci?.slice(0, 40) === p.kunci?.slice(0, 40)) === i,
    )
    .slice(0, 3)
  if (!teratas.length) return null

  return (
    <div className={s.sorotan}>
      <h3 className={s.label}>Paling banyak disitasi</h3>
      <ol className={s.grid}>
        {teratas.map((p) => (
          <li key={p.id} className={s.kartu}>
            <p className={s.angka}>
              {sitasi(p).toLocaleString('id-ID')}
              <span>sitasi</span>
            </p>
            <h4 className={s.judul}>
              {p.tautan ? (
                <a href={p.tautan} target="_blank" rel="noopener noreferrer">
                  {p.judul}
                </a>
              ) : (
                p.judul
              )}
            </h4>
            <p className={s.venue}>
              {p.venue && <span>{hurufJudul(p.venue)}</span>}
              {p.tahun && <span>{p.tahun}</span>}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}
