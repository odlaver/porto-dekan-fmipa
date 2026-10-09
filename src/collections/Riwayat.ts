import type { CollectionConfig } from 'payload'
import { masuk, publik } from '@/access'

export const Riwayat: CollectionConfig = {
  slug: 'riwayat',
  labels: { singular: 'Riwayat', plural: 'Jabatan, organisasi & penghargaan' },
  access: { read: publik, create: masuk, update: masuk, delete: masuk },
  defaultSort: '-tahunMulai',
  admin: {
    useAsTitle: 'nama',
    defaultColumns: ['nama', 'jenis', 'periode'],
    group: 'Profil',
  },
  fields: [
    { name: 'nama', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'jenis',
          type: 'select',
          required: true,
          options: [
            { label: 'Jabatan', value: 'jabatan' },
            { label: 'Organisasi', value: 'organisasi' },
            { label: 'Penghargaan', value: 'penghargaan' },
            { label: 'Pelatihan / narasumber', value: 'pelatihan' },
          ],
        },
        {
          name: 'periode',
          type: 'text',
          admin: { description: 'Contoh: 2020–2024 atau 2018–sekarang' },
        },
        { name: 'tahunMulai', type: 'number', admin: { description: 'Untuk urutan' } },
      ],
    },
    { name: 'sumber', type: 'text' },
  ],
}
