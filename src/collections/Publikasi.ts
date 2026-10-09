import type { CollectionConfig } from 'payload'
import { masuk, publik } from '@/access'
import { kunciJudul } from '@/sync/kunci'

export const INDEKS = [
  { label: 'Scopus', value: 'scopus' },
  { label: 'Web of Science', value: 'wos' },
  { label: 'Garuda / SINTA', value: 'garuda' },
  { label: 'Google Scholar', value: 'scholar' },
  { label: 'PDDikti', value: 'pddikti' },
]

export const Publikasi: CollectionConfig = {
  slug: 'publikasi',
  labels: { singular: 'Publikasi', plural: 'Publikasi' },
  access: { read: publik, create: masuk, update: masuk, delete: masuk },
  defaultSort: '-updatedAt',
  admin: {
    useAsTitle: 'judul',
    defaultColumns: ['judul', 'tahun', 'indeks', 'kuartil', 'sitasiScholar'],
    group: 'Karya',
    description:
      'Terisi otomatis dari Google Scholar dan SINTA lewat tombol sinkron di menu Metrik. Entri yang diedit manual tidak ditimpa, kecuali angka sitasi.',
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.judul) data.kunci = kunciJudul(data.judul)
        return data
      },
    ],
    beforeChange: [
      // Admin mengubah isi, jadi sinkron tidak boleh menimpanya
      ({ data, originalDoc, operation, context, req }) => {
        if (operation !== 'update' || context.sinkron || !req.user || !originalDoc) return data
        const berubah = (['judul', 'venue', 'penulis', 'tahun'] as const).some(
          (k) => k in data && data[k] !== originalDoc[k],
        )
        if (berubah) data.diubahManual = true
        return data
      },
    ],
  },
  fields: [
    { name: 'judul', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'tahun', type: 'number' },
        { name: 'indeks', type: 'select', hasMany: true, options: INDEKS },
      ],
    },
    { name: 'venue', type: 'text', label: 'Jurnal / prosiding' },
    { name: 'penulis', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'kuartil', type: 'text', admin: { description: 'Contoh: Q2' } },
        { name: 'akreditasi', type: 'text', admin: { description: 'Contoh: Sinta 2' } },
        { name: 'doi', type: 'text', label: 'DOI' },
      ],
    },
    { name: 'tautan', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'sitasiScholar', type: 'number', label: 'Sitasi Google Scholar' },
        { name: 'sitasiScopus', type: 'number', label: 'Sitasi Scopus' },
      ],
    },
    {
      name: 'sembunyikan',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Tidak tampil di website' },
    },
    {
      name: 'perluVerifikasi',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Kemungkinan milik penulis lain' },
    },
    {
      name: 'diubahManual',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Sinkron tidak menimpa judul, venue, dan penulis',
      },
    },
    { name: 'catatan', type: 'textarea', admin: { position: 'sidebar' } },
    { name: 'sumber', type: 'text' },
    {
      name: 'kunci',
      type: 'text',
      unique: true,
      index: true,
      admin: { hidden: true },
    },
  ],
}
