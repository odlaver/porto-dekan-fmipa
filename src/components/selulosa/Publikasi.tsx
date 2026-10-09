'use client'

import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import { useMemo, useState } from 'react'
import type { PublikasiKlien } from '@/lib/klien'
import s from './Publikasi.module.css'

const LABEL: Record<string, string> = {
  scopus: 'Scopus',
  wos: 'Web of Science',
  garuda: 'Garuda',
  scholar: 'Google Scholar',
  pddikti: 'PDDikti',
}
const PER_HALAMAN = 15

// Pengunjung mengetik istilah Indonesia, judul sering berbahasa Inggris
const PADANAN: Record<string, string[]> = {
  hidrogel: ['hydrogel'],
  selulosa: ['cellulose'],
  enzim: ['enzyme'],
  amilase: ['amylase'],
  bioetanol: ['bioethanol', 'ethanol'],
  etanol: ['ethanol'],
  limbah: ['waste'],
  singkong: ['cassava'],
  nanas: ['pineapple'],
  jerami: ['straw'],
  katalis: ['catalyst'],
  lipase: ['lipase'],
}

// Tebalkan nama beliau di daftar penulis
function Penulis({ teks }: { teks: string }) {
  return (
    <>
      {teks
        .split(
          /(\b(?:H(?:eri)?\.?\s*S(?:atria)?\.?|Satria,?\s*H(?:eri)?\.?|Heri Satria|HS Heri Satria)\b)/,
        )
        .map((b, i) => (i % 2 ? <strong key={i}>{b}</strong> : b))}
    </>
  )
}

export function Publikasi({ publikasi }: { publikasi: PublikasiKlien[] }) {
  const [cari, setCari] = useState('')
  const [indeks, setIndeks] = useState('semua')
  const [tahun, setTahun] = useState('semua')
  const [urut, setUrut] = useState<'baru' | 'sitasi'>('baru')
  const [batas, setBatas] = useState(PER_HALAMAN)

  const daftarTahun = useMemo(
    () => [...new Set(publikasi.map((p) => p.tahun).filter(Boolean))].sort((a, b) => b! - a!),
    [publikasi],
  )
  const hitung = (k: string) => publikasi.filter((p) => p.indeks.includes(k as never)).length

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase()
    const varian = q ? [q, ...(PADANAN[q] ?? [])] : []
    return publikasi
      .filter((p) => indeks === 'semua' || p.indeks.includes(indeks as never))
      .filter((p) => tahun === 'semua' || String(p.tahun) === tahun)
      .filter(
        (p) =>
          !q ||
          varian.some((v) =>
            `${p.judul} ${p.venue ?? ''} ${p.penulis ?? ''}`.toLowerCase().includes(v),
          ),
      )
      .sort((a, b) => (urut === 'sitasi' ? b.sitasi - a.sitasi : (b.tahun ?? 0) - (a.tahun ?? 0)))
  }, [publikasi, cari, indeks, tahun, urut])

  const ubah =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v)
      setBatas(PER_HALAMAN)
    }

  const reset = () => {
    setCari('')
    setIndeks('semua')
    setTahun('semua')
    setBatas(PER_HALAMAN)
  }

  return (
    <div>
      <div className={s.kontrol}>
        <label className={s.cari}>
          <span className="sr-only">Cari publikasi</span>
          <input
            type="search"
            value={cari}
            onChange={(e) => ubah(setCari)(e.target.value)}
            placeholder="Cari publikasi…"
          />
        </label>
        <label className={s.pilih}>
          <span>Tahun</span>
          <select value={tahun} onChange={(e) => ubah(setTahun)(e.target.value)}>
            <option value="semua">Semua</option>
            {daftarTahun.map((t) => (
              <option key={t} value={String(t)}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className={s.pilih}>
          <span>Urutkan</span>
          <select value={urut} onChange={(e) => setUrut(e.target.value as 'baru' | 'sitasi')}>
            <option value="baru">Terbaru</option>
            <option value="sitasi">Paling banyak disitasi</option>
          </select>
        </label>
      </div>

      <div role="group" aria-label="Saring menurut indeks" className={s.chip}>
        {['semua', ...Object.keys(LABEL)].map((k) => {
          const n = k === 'semua' ? publikasi.length : hitung(k)
          if (!n) return null
          return (
            <button
              key={k}
              type="button"
              aria-pressed={indeks === k}
              onClick={() => ubah(setIndeks)(k)}
            >
              {k === 'semua' ? 'Semua' : LABEL[k]} <span>{n}</span>
            </button>
          )
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {hasil.length
          ? `Menampilkan ${Math.min(batas, hasil.length)} dari ${hasil.length} publikasi`
          : ''}
      </p>

      {hasil.length === 0 ? (
        <div className={s.kosong}>
          <p>
            Tidak ada publikasi yang cocok
            {cari && (
              <>
                {' '}
                dengan <q>{cari}</q>
              </>
            )}
            .
          </p>
          <button type="button" onClick={reset}>
            Hapus filter
          </button>
        </div>
      ) : (
        <ol className={s.daftar}>
          {hasil.slice(0, batas).map((p, i, arr) => {
            const n = p.sitasi
            // Urutan terbaru: tahun tampil sekali di awal kelompoknya
            const awal = urut === 'baru' && (i === 0 || arr[i - 1].tahun !== p.tahun)
            const tampilTahun = urut === 'sitasi' || awal
            return (
              <li key={p.id} data-awal={awal}>
                <span className={s.kolomTahun} aria-hidden="true">
                  {tampilTahun ? p.tahun : ''}
                </span>
                <div className={s.isi}>
                  <p className={s.meta}>
                    {p.tahun && <span className="sr-only">{p.tahun}</span>}
                    {p.indeks.map((k) => (
                      <span key={k}>
                        {LABEL[k]}
                        {k === 'scopus' && p.kuartil && ` ${p.kuartil}`}
                        {k === 'garuda' &&
                          p.akreditasi &&
                          p.akreditasi !== 'Unknown' &&
                          `, ${p.akreditasi}`}
                      </span>
                    ))}
                  </p>
                  <h3 className={s.judul}>
                    {p.tautan ? (
                      <a href={p.tautan} target="_blank" rel="noopener noreferrer">
                        {p.judul}
                        <ArrowUpRight
                          className={s.panah}
                          size={15}
                          weight="bold"
                          aria-hidden="true"
                        />
                      </a>
                    ) : (
                      p.judul
                    )}
                  </h3>
                  {p.venue && <p className={s.venue}>{p.venue}</p>}
                  {p.penulis && (
                    <p className={s.penulis}>
                      <Penulis teks={p.penulis} />
                    </p>
                  )}
                </div>
                {n > 0 && (
                  <p className={s.sitasi}>
                    <strong>{n.toLocaleString('id-ID')}</strong> sitasi
                  </p>
                )}
              </li>
            )
          })}
        </ol>
      )}

      {batas < hasil.length && (
        <button type="button" className={s.lagi} onClick={() => setBatas((b) => b + PER_HALAMAN)}>
          Tampilkan {Math.min(PER_HALAMAN, hasil.length - batas)} lagi
        </button>
      )}
    </div>
  )
}
