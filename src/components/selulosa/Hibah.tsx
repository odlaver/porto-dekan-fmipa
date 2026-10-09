'use client'

import { useState } from 'react'
import type { RisetKlien } from '@/lib/klien'
import s from './Hibah.module.css'

const JENIS = [
  { nilai: 'penelitian', label: 'Penelitian' },
  { nilai: 'pengabdian', label: 'Pengabdian' },
] as const
const AWAL = 8

const juta = (n: number) =>
  `Rp${(n / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`

export function Hibah({ riset }: { riset: RisetKlien[] }) {
  const [jenis, setJenis] = useState<(typeof JENIS)[number]['nilai']>('penelitian')
  const [ketua, setKetua] = useState(false)
  const [semua, setSemua] = useState(false)

  const daftar = riset.filter((r) => r.jenis === jenis && (!ketua || r.peran === 'ketua'))
  const tampil = semua ? daftar : daftar.slice(0, AWAL)
  const totalDana = daftar.reduce((a, r) => a + (r.dana ?? 0), 0)
  const pilih = (j: typeof jenis) => {
    setJenis(j)
    setSemua(false)
  }

  return (
    <div>
      <div className={s.kontrol}>
        <div role="group" aria-label="Jenis hibah" className={s.tab}>
          {JENIS.map((j) => (
            <button
              key={j.nilai}
              type="button"
              aria-pressed={jenis === j.nilai}
              onClick={() => pilih(j.nilai)}
            >
              {j.label}
              <span>{riset.filter((r) => r.jenis === j.nilai).length}</span>
            </button>
          ))}
        </div>
        <label className={s.saring}>
          <input type="checkbox" checked={ketua} onChange={(e) => setKetua(e.target.checked)} />
          Sebagai ketua
        </label>
      </div>

      <p className={`mono ${s.ringkas}`} aria-live="polite">
        {daftar.length} {jenis}
        {totalDana > 0 && ` · ${juta(totalDana)}`}
      </p>

      {daftar.length === 0 ? (
        <p className={s.kosong}>
          Tidak ada {jenis} dengan peran ketua.{' '}
          <button type="button" onClick={() => setKetua(false)}>
            Semua peran
          </button>
        </p>
      ) : (
        <table className={s.tabel}>
          <caption className="sr-only">Daftar {jenis}, diurutkan dari tahun terbaru</caption>
          <thead>
            <tr className="mono">
              <th scope="col">Tahun</th>
              <th scope="col">Judul</th>
              <th scope="col">Skema</th>
              <th scope="col">Dana</th>
              <th scope="col">Peran</th>
            </tr>
          </thead>
          <tbody>
            {tampil.map((r) => (
              <tr key={r.id} data-peran={r.peran ?? ''}>
                <td className={s.tahun}>{r.tahun}</td>
                <th scope="row" className={s.judul}>
                  {r.judul}
                  {r.ketua && r.peran !== 'ketua' && (
                    <span className={s.tim}>Ketua tim: {r.ketua}</span>
                  )}
                </th>
                <td className={s.skema}>{r.skema ?? '-'}</td>
                <td className={s.dana}>{r.dana ? juta(r.dana) : '-'}</td>
                <td>
                  {r.peran && (
                    <span className={s.peran}>{r.peran === 'ketua' ? 'Ketua' : 'Anggota'}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {daftar.length > AWAL && (
        <button
          type="button"
          className={s.lagi}
          aria-expanded={semua}
          onClick={() => setSemua((v) => !v)}
        >
          {semua ? 'Ringkas' : `Semua ${daftar.length} ${jenis}`}
        </button>
      )}
    </div>
  )
}
