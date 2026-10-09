'use client'

import { useState } from 'react'
import type { ringkasMengajar } from '@/lib/mengajar'
import s from './TabelMatkul.module.css'

type Ringkas = ReturnType<typeof ringkasMengajar>

export function TabelMatkul({
  data,
  bahanAjar,
  tanpaRingkasan,
}: {
  data: Ringkas
  bahanAjar?: string | null
  tanpaRingkasan?: boolean
}) {
  const [semua, setSemua] = useState(false)
  if (!data.total) {
    return (
      <p className={s.kosong}>
        Riwayat mengajar belum diisi. Tambahkan lewat menu Pengalaman mengajar di admin.
      </p>
    )
  }
  const tampil = semua ? data.matkul : data.matkul.slice(0, 10)

  return (
    <div>
      {!tanpaRingkasan && (
        <p className={s.ringkas}>
          <strong>{data.total}</strong> kelas dari <strong>{data.matkul.length}</strong> mata
          kuliah, tercatat di PDDikti sejak semester {data.sejak}.
        </p>
      )}
      {bahanAjar && <p className={s.catatan}>{bahanAjar}.</p>}

      <table className={s.tabel} data-rapat={tanpaRingkasan}>
        <caption className="sr-only">
          Mata kuliah yang diampu, diurutkan menurut jumlah kelas
        </caption>
        <thead>
          <tr>
            <th scope="col">Mata kuliah</th>
            <th scope="col">Kelas</th>
            <th scope="col">Rentang semester</th>
          </tr>
        </thead>
        <tbody>
          {tampil.map((m) => (
            <tr key={`${m.nama}|${m.kampus}`}>
              <th scope="row">
                {m.nama}
                {m.kampus !== 'Universitas Lampung' && <span className={s.kampus}>{m.kampus}</span>}
              </th>
              <td className={s.angka}>{m.kelas}</td>
              <td className={s.rentang}>
                {m.pertama === m.terakhir ? m.pertama : `${m.pertama} sampai ${m.terakhir}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.matkul.length > 10 && (
        <button
          type="button"
          className={s.lagi}
          aria-expanded={semua}
          onClick={() => setSemua((v) => !v)}
        >
          {semua ? 'Ringkas daftar' : `Tampilkan ${data.matkul.length - 10} mata kuliah lainnya`}
        </button>
      )}
    </div>
  )
}
