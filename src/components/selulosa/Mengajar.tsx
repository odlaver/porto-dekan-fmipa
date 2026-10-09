'use client'

import { useState } from 'react'
import { TabelMatkul } from './TabelMatkul'
import type { ringkasMengajar } from '@/lib/mengajar'
import s from './Mengajar.module.css'

type Ringkas = ReturnType<typeof ringkasMengajar>

export function Mengajar({ data, bahanAjar }: { data: Ringkas; bahanAjar?: string | null }) {
  const [buka, setBuka] = useState(false)
  if (!data.total) return <TabelMatkul data={data} />

  const unila = data.matkul.filter((m) => m.kampus === 'Universitas Lampung')
  const teratas = unila.slice(0, 7)
  const maks = teratas[0]?.kelas ?? 1
  const lain = data.kampus
    .filter((k) => k !== 'Universitas Lampung')
    .map((k) => ({
      kampus: k,
      kelas: data.matkul.filter((m) => m.kampus === k).reduce((a, m) => a + m.kelas, 0),
    }))

  return (
    <div>
      <div className={s.bento}>
        <div className={`${s.petak} ${s.besar}`}>
          <p className={s.angka}>{data.total}</p>
          <p>kelas dari {data.matkul.length} mata kuliah</p>
        </div>
        <div className={`${s.petak} ${s.semester}`}>
          <p className={s.angkaKecil}>{data.sejak?.split(' ')[0]}</p>
          <p>semester pertama</p>
        </div>

        <figure className={`${s.petak} ${s.grafik}`}>
          <figcaption>
            <h3>Mata kuliah terbanyak di Unila</h3>
            <p className={`mono ${s.satuan}`}>Kelas</p>
          </figcaption>
          <ol className={s.batang}>
            {teratas.map((m) => (
              <li
                key={m.nama}
                title={`${m.nama}: ${m.kelas} kelas, ${m.pertama} sampai ${m.terakhir}`}
              >
                <span className={s.nama}>{m.nama}</span>
                <span className={s.nilai}>{m.kelas}</span>
                <span className={s.jalur} aria-hidden="true">
                  <span style={{ width: `${(m.kelas / maks) * 100}%` }} />
                </span>
              </li>
            ))}
          </ol>
        </figure>

        {lain.length > 0 && (
          <div className={`${s.petak} ${s.samping}`}>
            <h3>Kampus lain</h3>
            <ul className={s.kampus}>
              {lain.map((k) => (
                <li key={k.kampus}>
                  <span>{k.kampus}</span>
                  <span>{k.kelas} kelas</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {bahanAjar && (
          <div className={`${s.petak} ${s.samping}`}>
            <h3>Bahan ajar</h3>
            <p>{bahanAjar}.</p>
          </div>
        )}
      </div>

      <button
        type="button"
        className={s.lagi}
        aria-expanded={buka}
        aria-controls="semua-matkul"
        onClick={() => setBuka((v) => !v)}
      >
        {buka ? 'Ringkas' : `Semua ${data.matkul.length} mata kuliah`}
      </button>
      {buka && (
        <div id="semua-matkul" className={s.lengkap}>
          <TabelMatkul data={data} tanpaRingkasan />
        </div>
      )}
    </div>
  )
}
