import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import type React from 'react'
import type { Data } from '@/lib/data'
import { angka, media, tanggal } from '@/lib/data'
import { RantaiSelulosa } from './RantaiSelulosa'
import s from './Hero.module.css'

// "*frasa*" jadi aksen serif miring; baris dipatah tepat setelahnya
function Tagline({ teks }: { teks: string }) {
  const bagian = teks.split(/(\*[^*]+\*)/)
  return (
    <>
      {bagian.map((b, i) =>
        b.startsWith('*') ? (
          <span key={i}>
            <span className="aksen">{b.slice(1, -1)}</span>
            {bagian[i + 1]?.trim() && <br />}
          </span>
        ) : (
          i > 0 ? b.trimStart() : b
        ),
      )}
    </>
  )
}

export function Hero({
  profil,
  metrik,
  pendidikan,
}: Pick<Data, 'profil' | 'metrik' | 'pendidikan'>) {
  const foto = media(profil.foto)
  const doktor = [...pendidikan].sort((a, b) => b.tahunLulus - a.tahunLulus)[0]
  const scholar =
    profil.scholarId && `https://scholar.google.com/citations?user=${profil.scholarId}`
  const sinta =
    profil.sintaId && `https://sinta.kemdiktisaintek.go.id/authors/profile/${profil.sintaId}`
  const angkaUtama = [
    { nilai: metrik.scholar?.sitasi, label: 'Sitasi', sumber: 'Google Scholar', url: scholar },
    { nilai: metrik.scholar?.hIndex, label: 'h-index', sumber: 'Google Scholar', url: scholar },
    { nilai: metrik.scopus?.artikel, label: 'Artikel Scopus', sumber: 'SINTA', url: sinta },
    { nilai: metrik.sinta?.skor, label: 'Skor SINTA', sumber: 'SINTA', url: sinta },
  ].filter((a) => a.nilai)
  const diperbarui = metrik.sinta?.diperbarui ?? metrik.scholar?.diperbarui
  const [depan, ...belakang] = profil.nama.split(' ')

  const data = [
    ['NIP', profil.nip],
    ['NIDN', profil.nidn],
    ['Jabatan', profil.jabatanFungsional],
    ['Bidang', profil.bidang],
    doktor && ['Doktor', `${doktor.perguruanTinggi}, ${doktor.tahunLulus}`],
  ].filter((d): d is [string, string] => Boolean(d && d[1]))

  return (
    <section className={s.hero} data-nada="gelap" aria-labelledby="judul-utama">
      {/* Hero tampil tanpa menunggu JS, demi LCP */}
      <div className={`wrap ${s.meta}`}>
        <p className="mono">Dekan FMIPA</p>
        <p className="mono">Universitas Lampung</p>
        <p className="mono">Periode {profil.periode}</p>
        <p className="mono">
          {profil.gelarDepan} {profil.nama}, {profil.gelarBelakang}
        </p>
      </div>

      <div className={`wrap ${s.grid}`}>
        <div className={s.kiri}>
          <p className={s.tagline}>
            <Tagline teks={profil.pernyataan} />
          </p>
          <h1 id="judul-utama" className={s.nama}>
            {depan}
            <br />
            {belakang.join(' ')}
          </h1>
        </div>

        {foto?.url && (
          <figure className={s.kartu}>
            <div className={s.kartuAtas}>
              <span className="mono">Profil</span>
              <span className="mono">FMIPA / Unila</span>
            </div>
            <div className={s.foto}>
              <Image
                src={foto.url}
                alt={foto.alt}
                width={foto.width ?? 431}
                height={foto.height ?? 579}
                priority
                fetchPriority="high"
                sizes="18rem"
              />
            </div>
            <figcaption>
              <dl className={s.data}>
                {data.map(([k, v]) => (
                  <div key={k}>
                    <dt className="mono">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </figcaption>
          </figure>
        )}
      </div>

      <div className={s.rantai}>
        <RantaiSelulosa />
      </div>

      {angkaUtama.length > 0 && (
        <div className={`wrap ${s.metrik}`}>
          <dl>
            {angkaUtama.map((a, i) => (
              <div key={a.label} data-muncul="" style={{ '--i': i } as React.CSSProperties}>
                <dt className="mono">{a.label}</dt>
                <dd>{angka(a.nilai)}</dd>
                {a.url && (
                  <dd className={s.sumberDd}>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`ikon-tautan ${s.sumber}`}
                    >
                      {a.sumber}
                      <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
                    </a>
                  </dd>
                )}
              </div>
            ))}
          </dl>
          {diperbarui && <p className={`mono ${s.catatan}`}>Per {tanggal(diperbarui)}</p>}
        </div>
      )}
    </section>
  )
}
