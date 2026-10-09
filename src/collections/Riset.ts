import type { CollectionConfig } from 'payload'
import { masuk, publik } from '@/access'

export const Riset: CollectionConfig = {
  slug: 'riset',
  labels: { singular: 'Penelitian / pengabdian', plural: 'Penelitian & pengabdian' },
  access: { read: publik, create: masuk, update: masuk, delete: masuk },
  defaultSort: '-tahun',
  admin: {
    useAsTitle: 'judul',
    defaultColumns: ['judul', 'jenis', 'tahun', 'peran'],
    group: 'Karya',
  },
  fields: [
    { name: 'judul', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'jenis',
          type: 'select',
          required: true,
          options: [
            { label: 'Penelitian', value: 'penelitian' },
            { label: 'Pengabdian', value: 'pengabdian' },
          ],
        },
        { name: 'tahun', type: 'number', required: true },
        {
          name: 'peran',
          type: 'select',
          options: [
            { label: 'Ketua', value: 'ketua' },
            { label: 'Anggota', value: 'anggota' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'ketua', type: 'text' },
        { name: 'anggota', type: 'text', admin: { description: 'Pisahkan dengan koma' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'skema', type: 'text' },
        { name: 'dana', type: 'number', admin: { description: 'Rupiah, tanpa titik' } },
      ],
    },
    { name: 'sumber', type: 'text' },
  ],
}
