import type { CollectionConfig } from 'payload'
import { masuk, publik } from '@/access'

export const Mengajar: CollectionConfig = {
  slug: 'mengajar',
  labels: { singular: 'Mata kuliah', plural: 'Pengalaman mengajar' },
  access: { read: publik, create: masuk, update: masuk, delete: masuk },
  defaultSort: '-semester',
  admin: {
    useAsTitle: 'mataKuliah',
    defaultColumns: ['mataKuliah', 'semester', 'kelas', 'perguruanTinggi'],
    group: 'Karya',
  },
  fields: [
    { name: 'mataKuliah', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'semester',
          type: 'text',
          required: true,
          admin: { description: 'Format PDDikti, contoh: 2025/2026 Genap' },
        },
        { name: 'kode', type: 'text' },
        { name: 'kelas', type: 'text' },
      ],
    },
    { name: 'perguruanTinggi', type: 'text', defaultValue: 'Universitas Lampung' },
    { name: 'sumber', type: 'text' },
  ],
}
