import type { CollectionConfig } from 'payload'
import { masuk, publik } from '@/access'

export const Pendidikan: CollectionConfig = {
  slug: 'pendidikan',
  labels: { singular: 'Pendidikan', plural: 'Riwayat pendidikan' },
  access: { read: publik, create: masuk, update: masuk, delete: masuk },
  defaultSort: '-tahunLulus',
  admin: {
    useAsTitle: 'perguruanTinggi',
    defaultColumns: ['jenjang', 'perguruanTinggi', 'programStudi', 'tahunLulus'],
    group: 'Profil',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'jenjang',
          type: 'select',
          required: true,
          options: ['S1', 'S2', 'S3', 'Profesi', 'Lainnya'],
        },
        { name: 'tahunMasuk', type: 'number' },
        { name: 'tahunLulus', type: 'number', required: true },
      ],
    },
    { name: 'perguruanTinggi', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'programStudi', type: 'text' },
        { name: 'gelar', type: 'text', admin: { description: 'Contoh: Doctor of Engineering' } },
      ],
    },
    { name: 'negara', type: 'text', defaultValue: 'Indonesia' },
    { name: 'sumber', type: 'text', admin: { description: 'URL asal data' } },
  ],
}
