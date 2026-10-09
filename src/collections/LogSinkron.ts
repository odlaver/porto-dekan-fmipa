import type { CollectionConfig } from 'payload'
import { masuk } from '@/access'

export const LogSinkron: CollectionConfig = {
  slug: 'log-sinkron',
  labels: { singular: 'Log sinkron', plural: 'Log sinkron' },
  access: { read: masuk, create: masuk, update: () => false, delete: masuk },
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'ringkasan',
    defaultColumns: ['sumber', 'status', 'ringkasan', 'createdAt'],
    group: 'Sistem',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'sumber', type: 'select', options: ['scholar', 'sinta'], required: true },
        { name: 'status', type: 'select', options: ['berhasil', 'gagal'], required: true },
      ],
    },
    { name: 'ringkasan', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'ditambahkan', type: 'number' },
        { name: 'diperbarui', type: 'number' },
      ],
    },
    { name: 'pesan', type: 'textarea' },
  ],
}
