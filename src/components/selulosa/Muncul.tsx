import type React from 'react'

type Props = {
  teks: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  id?: string
  className?: string
  mulai?: number
}

// Tiap kata naik dari balik masker saat judul masuk layar
export function JudulBaris({ teks, as: Tag = 'h2', id, className, mulai = 0 }: Props) {
  const kata = teks.split(/\s+/)
  return (
    <Tag id={id} className={className} data-muncul-baris="" aria-label={teks}>
      {kata.map((k, i) => (
        <span key={i} aria-hidden="true">
          <span className="baris" style={{ '--i': mulai + i } as React.CSSProperties}>
            <span>{k}</span>
          </span>{' '}
        </span>
      ))}
    </Tag>
  )
}
