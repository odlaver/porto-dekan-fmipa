import type React from 'react'
import type { ReactNode } from 'react'
import { JudulBaris } from './Muncul'
import s from './Bab.module.css'

type Props = {
  id: string
  nomor: string
  label: string
  judul: string
  aksen?: string
  nada?: 'terang' | 'gelap'
  children: ReactNode
}

// Satu bab halaman: label data, judul besar, lalu isi
export function Bab({ id, nomor, label, judul, aksen, nada = 'terang', children }: Props) {
  return (
    <section id={id} className={s.bab} data-nada={nada} aria-labelledby={`${id}-judul`}>
      <div className="wrap">
        <header className={s.kepala}>
          <p className={`mono ${s.label}`} data-muncul="">
            <span>({nomor})</span>
            <span>{label}</span>
          </p>
          <div className={s.judulBaris}>
            <JudulBaris as="h2" id={`${id}-judul`} className={s.judul} teks={judul} />
            {aksen && (
              <p
                className={`aksen ${s.aksen}`}
                data-muncul=""
                style={{ '--i': 3 } as React.CSSProperties}
              >
                {aksen}
              </p>
            )}
          </div>
        </header>
        <div className={s.isi}>{children}</div>
      </div>
    </section>
  )
}
