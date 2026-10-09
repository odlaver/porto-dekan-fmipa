import type React from 'react'
import type { Data } from '@/lib/data'
import { TeksIsi } from './TeksIsi'
import s from './Profil.module.css'

const JENJANG: Record<string, string> = { S1: 'Sarjana', S2: 'Magister', S3: 'Doktor' }

export function Profil({
  profil,
  pendidikan,
  riwayat,
}: Pick<Data, 'profil' | 'pendidikan' | 'riwayat'>) {
  const per = (jenis: string) => riwayat.filter((r) => r.jenis === jenis)
  const studi = [...pendidikan].sort((a, b) => a.tahunLulus - b.tahunLulus)
  const kolom = [
    ['Jabatan', per('jabatan')],
    ['Organisasi', per('organisasi')],
    ['Penghargaan', per('penghargaan')],
  ] as const
  const pelatihan = per('pelatihan')

  return (
    <div className={s.profil}>
      {profil.narasi && (
        <div className={s.narasi}>
          <TeksIsi teks={profil.narasi} />
        </div>
      )}

      {studi.length > 0 && (
        <ol className={s.studi} aria-label="Riwayat pendidikan">
          {studi.map((p, i) => (
            <li key={p.id} data-muncul="" style={{ '--i': i } as React.CSSProperties}>
              <span className={s.simpul} aria-hidden="true" />
              <span className={`mono ${s.jenjang}`}>
                {p.jenjang} · {JENJANG[p.jenjang] ?? p.jenjang}
              </span>
              <span className={s.tahun}>{p.tahunLulus}</span>
              <span className={s.prodi}>{p.programStudi}</span>
              <span className={s.kampus}>
                {p.perguruanTinggi}
                {p.negara && p.negara !== 'Indonesia' && `, ${p.negara}`}
              </span>
            </li>
          ))}
        </ol>
      )}

      <div className={s.kolom}>
        {kolom.map(([judul, isi], k) =>
          isi.length ? (
            <section key={judul} data-muncul="" style={{ '--i': k } as React.CSSProperties}>
              <h3 className={`mono ${s.sub}`}>{judul}</h3>
              <ul className={s.daftar}>
                {isi.map((r) => (
                  <li key={r.id}>
                    <span className={s.periode}>{r.periode}</span>
                    <span>{r.nama}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null,
        )}
      </div>

      {pelatihan.length > 0 && (
        <section className={s.pelatihan} data-muncul="">
          <h3 className={`mono ${s.sub}`}>Pelatihan, narasumber, dan kepanitiaan</h3>
          <ul>
            {pelatihan.map((r) => (
              <li key={r.id}>
                <span className={s.periode}>{r.periode}</span>
                <span>{r.nama}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
