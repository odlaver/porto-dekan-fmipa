import type { CollectionConfig } from 'payload'
import { masuk, publik } from '@/access'

export const WARNA_TEMA = [
  { label: 'Hijau', value: 'hijau' },
  { label: 'Oranye', value: 'amber' },
  { label: 'Ungu', value: 'biru' },
  { label: 'Merah bata', value: 'bata' },
]

export const TemaRoadmap: CollectionConfig = {
  slug: 'tema-roadmap',
  labels: { singular: 'Tema riset', plural: 'Tema roadmap' },
  access: { read: publik, create: masuk, update: masuk, delete: masuk },
  defaultSort: 'urutan',
  admin: { useAsTitle: 'nama', defaultColumns: ['nama', 'warna', 'urutan'], group: 'Roadmap' },
  fields: [
    { name: 'nama', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'warna', type: 'select', required: true, options: WARNA_TEMA },
        { name: 'urutan', type: 'number', defaultValue: 0 },
      ],
    },
    {
      name: 'deskripsi',
      type: 'textarea',
      admin: { description: 'Satu sampai dua kalimat untuk bagian Fokus riset' },
    },
    {
      name: 'kataKunci',
      type: 'text',
      admin: {
        description:
          'Pisahkan dengan koma. Publikasi yang judulnya memuat kata ini tampil sebagai karya tema.',
      },
    },
  ],
}

export const Roadmap: CollectionConfig = {
  slug: 'roadmap',
  labels: { singular: 'Titik roadmap', plural: 'Roadmap penelitian' },
  access: { read: publik, create: masuk, update: masuk, delete: masuk },
  defaultSort: 'tahun',
  admin: {
    useAsTitle: 'judul',
    defaultColumns: ['judul', 'tahun', 'tema', 'rencana'],
    group: 'Roadmap',
    description:
      'Tiap titik menjadi cabang tinta di website. Tandai "Rencana" untuk riset ke depan.',
  },
  fields: [
    { name: 'judul', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'tahun', type: 'number', required: true },
        { name: 'tema', type: 'relationship', relationTo: 'tema-roadmap' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'jenis', type: 'text', admin: { description: 'Contoh: Publikasi Scopus Q2' } },
        { name: 'keterangan', type: 'text', admin: { description: 'Contoh: DIPA BLU FMIPA' } },
      ],
    },
    {
      name: 'rencana',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Riset yang belum berjalan' },
    },
  ],
}
