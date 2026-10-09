import s from './Ringkasan.module.css'

// Pintasan ke situs publik di bawah menu navigasi
export function TautanSitus() {
  return (
    <a href="/" target="_blank" rel="noopener noreferrer" className={s.tautanSitus}>
      Buka situs ↗
    </a>
  )
}
