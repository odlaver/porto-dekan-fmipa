import { ArrowUp, ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import type React from 'react'
import { JudulBaris } from './Muncul'
import type { Data } from '@/lib/data'
import s from './Footer.module.css'

export function Footer({ profil }: Pick<Data, 'profil'>) {
  const tautan = [
    profil.scholarId && [
      'Google Scholar',
      `https://scholar.google.com/citations?user=${profil.scholarId}`,
    ],
    profil.sintaId && [
      'SINTA',
      `https://sinta.kemdiktisaintek.go.id/authors/profile/${profil.sintaId}`,
    ],
    profil.profilFmipa && ['Profil staf FMIPA', profil.profilFmipa],
  ].filter(Boolean) as [string, string][]

  return (
    <footer id="kontak" className={s.footer} data-nada="gelap" aria-labelledby="kontak-judul">
      <div className="wrap">
        <p className={`mono ${s.label}`} data-muncul="">
          <span>(08)</span>
          <span>Kontak</span>
        </p>
        <JudulBaris
          as="h2"
          id="kontak-judul"
          className={s.judul}
          teks="Dekanat FMIPA Universitas Lampung"
        />

        <div className={s.grid}>
          {profil.alamat && (
            <div data-muncul="">
              <h3 className="mono">Alamat</h3>
              <address>
                {profil.alamat.split('\n').map((b) => (
                  <span key={b}>{b}</span>
                ))}
                {profil.email && (
                  <a className="tautan" href={`mailto:${profil.email}`}>
                    {profil.email}
                  </a>
                )}
              </address>
            </div>
          )}
          {tautan.length > 0 && (
            <div data-muncul="" style={{ '--i': 1 } as React.CSSProperties}>
              <h3 className="mono">Profil daring</h3>
              <ul>
                {tautan.map(([label, url]) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className={s.besar}>
                      {label}
                      <ArrowUpRight size={22} weight="regular" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <p className={s.merek} aria-hidden="true">
        {profil.nama}
      </p>

      <div className={`wrap ${s.bawah}`}>
        <span className="mono">
          © {new Date().getFullYear()} {profil.gelarDepan} {profil.nama}, {profil.gelarBelakang}
        </span>
        <a href="#isi" className={`mono ikon-tautan ${s.atas}`}>
          Ke atas
          <ArrowUp size={14} weight="bold" aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}
