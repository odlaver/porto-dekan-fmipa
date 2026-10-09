import s from './Merek.module.css'

function Heksagon({ ukuran }: { ukuran: number }) {
  return (
    <svg width={ukuran} height={ukuran} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#0c1a14" />
      <path
        d="M16 6.5 24.2 11.25v9.5L16 25.5 7.8 20.75v-9.5Z"
        fill="none"
        stroke="#c9f36a"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="6.5" r="2.4" fill="#c9f36a" />
    </svg>
  )
}

// Logo di halaman masuk
export function Logo() {
  return (
    <div className={s.logo}>
      <Heksagon ukuran={56} />
      <div>
        <p className={s.nama}>Heri Satria</p>
        <p className={s.sub}>Admin portofolio · FMIPA Unila</p>
      </div>
    </div>
  )
}

// Ikon kecil di navigasi admin; slot Payload sempit, jadi tanpa kotak latar
export function Ikon() {
  return (
    <svg width="20" height="20" viewBox="6 4 20 24" aria-hidden="true">
      <path
        d="M16 6.5 24.2 11.25v9.5L16 25.5 7.8 20.75v-9.5Z"
        fill="none"
        stroke="#c9f36a"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="6.5" r="2.4" fill="#c9f36a" />
    </svg>
  )
}
