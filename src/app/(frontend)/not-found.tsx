import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import s from './not-found.module.css'

export default function TidakDitemukan() {
  return (
    <main id="isi" className={s.halaman}>
      <div className={`wrap ${s.isi}`}>
        <p className={s.kode} aria-hidden="true">
          404
        </p>
        <h1 className={s.judul}>Halaman tidak ditemukan</h1>
        <a href="/" className={s.tombol}>
          <ArrowLeft size={16} weight="bold" aria-hidden="true" />
          Beranda
        </a>
      </div>
    </main>
  )
}
