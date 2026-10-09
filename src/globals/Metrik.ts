import type { GlobalConfig } from 'payload'
import { masuk, publik } from '@/access'

const angka = (name: string, label: string) => ({ name, label, type: 'number' as const })

export const Metrik: GlobalConfig = {
  slug: 'metrik',
  label: 'Metrik & sinkron',
  access: { read: publik, update: masuk },
  admin: {
    group: 'Sistem',
    description:
      'Angka diperbarui otomatis tiap Senin 02.00 dari Google Scholar dan SINTA. Tekan tombol di bawah untuk memperbarui sekarang.',
  },
  fields: [
    {
      name: 'tombolSinkron',
      type: 'ui',
      admin: { components: { Field: '/components/admin/SyncButton#SyncButton' } },
    },
    {
      name: 'scholar',
      label: 'Google Scholar',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            angka('sitasi', 'Sitasi'),
            angka('hIndex', 'h-index'),
            angka('i10', 'i10-index'),
            angka('entri', 'Jumlah entri'),
          ],
        },
        { name: 'diperbarui', type: 'date', admin: { readOnly: true } },
      ],
    },
    {
      name: 'scopus',
      label: 'Scopus (via SINTA)',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            angka('artikel', 'Artikel'),
            angka('sitasi', 'Sitasi'),
            angka('hIndex', 'h-index'),
          ],
        },
      ],
    },
    {
      name: 'sinta',
      label: 'SINTA',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [angka('skor', 'Skor keseluruhan'), angka('skor3th', 'Skor 3 tahun')],
        },
        { name: 'diperbarui', type: 'date', admin: { readOnly: true } },
      ],
    },
  ],
}
