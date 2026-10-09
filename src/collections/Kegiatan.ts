import type { CollectionConfig } from 'payload'
import { masuk, publik } from '@/access'

export const Kegiatan: CollectionConfig = {
  slug: 'kegiatan',
  labels: { singular: 'Kegiatan', plural: 'Kegiatan' },
  access: { read: publik, create: masuk, update: masuk, delete: masuk },
  defaultSort: '-tanggal',
  admin: {
    useAsTitle: 'judul',
    defaultColumns: ['judul', 'tanggal', 'tampil'],
    group: 'Karya',
  },
  fields: [
    { name: 'judul', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'tanggal',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
        },
        { name: 'tempat', type: 'text' },
      ],
    },
    { name: 'ringkasan', type: 'textarea' },
    { name: 'gambar', type: 'upload', relationTo: 'media' },
    { name: 'sumber', type: 'text', admin: { description: 'Tautan berita asli' } },
    {
      name: 'tampil',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
