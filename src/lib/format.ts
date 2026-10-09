import type { Kegiatan, Media } from '@/payload-types'

export const media = (m: unknown) => (m && typeof m === 'object' ? (m as Media) : undefined)

export const tgl = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })

export const gambarDari = (k: Kegiatan) =>
  k.gambar && typeof k.gambar === 'object' ? (k.gambar as Media) : undefined

export const angka = (n?: number | null) => (n == null ? '' : n.toLocaleString('id-ID'))

export const tanggal = (iso?: string | null, opsi: Intl.DateTimeFormatOptions = {}) =>
  iso
    ? new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
        ...opsi,
      })
    : ''
