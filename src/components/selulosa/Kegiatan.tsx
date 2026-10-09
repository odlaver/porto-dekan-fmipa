import Image from 'next/image'
import { gambarDari, tgl } from '@/lib/data'
import type { Kegiatan } from '@/payload-types'
import { Carousel } from './Carousel'
import s from './Kegiatan.module.css'

export function Kegiatan({ kegiatan }: { kegiatan: Kegiatan[] }) {
  if (!kegiatan.length) {
    return (
      <p className={s.kosong}>
        Belum ada kegiatan yang ditampilkan. Tambahkan dari menu Kegiatan di admin.
      </p>
    )
  }

  return (
    <Carousel label="Kegiatan terbaru" lebar="clamp(17rem, 30vw, 24rem)">
      {kegiatan.map((k) => {
        const g = gambarDari(k)
        return (
          <article key={k.id} className={s.kartu} data-gambar={Boolean(g?.url)}>
            {g?.url ? (
              <Image
                className={s.foto}
                src={g.url}
                alt=""
                width={g.width ?? 600}
                height={g.height ?? 400}
                sizes="(max-width: 760px) 85vw, 24rem"
              />
            ) : (
              <div className={s.tanpaFoto} aria-hidden="true">
                <span>{new Date(k.tanggal).getDate()}</span>
                {new Date(k.tanggal).toLocaleDateString('id-ID', {
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'Asia/Jakarta',
                })}
              </div>
            )}
            <div className={s.isi}>
              <time dateTime={k.tanggal} className={s.tanggal}>
                {tgl(k.tanggal)}
              </time>
              <h3 className={s.judul}>{k.judul}</h3>
              {k.ringkasan && <p className={s.ringkasan}>{k.ringkasan}</p>}
              {k.sumber && (
                <a className={s.tautan} href={k.sumber} target="_blank" rel="noopener noreferrer">
                  Selengkapnya<span className="sr-only">: {k.judul}</span>
                </a>
              )}
            </div>
          </article>
        )
      })}
    </Carousel>
  )
}
