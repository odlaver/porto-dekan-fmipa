import type { GlobalConfig } from 'payload'
import { masuk, publik } from '@/access'

export const Profil: GlobalConfig = {
  slug: 'profil',
  label: 'Profil',
  access: { read: publik, update: masuk },
  admin: { group: 'Profil' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identitas',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'gelarDepan', type: 'text' },
                { name: 'nama', type: 'text', required: true },
                { name: 'gelarBelakang', type: 'text' },
              ],
            },
            { name: 'jabatan', type: 'text', required: true },
            {
              type: 'row',
              fields: [
                { name: 'periode', type: 'text', admin: { description: 'Contoh: 2024–2028' } },
                { name: 'jurusan', type: 'text' },
                { name: 'jabatanFungsional', type: 'text' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'nip', type: 'text', label: 'NIP' },
                { name: 'nidn', type: 'text', label: 'NIDN' },
                { name: 'bidang', type: 'text', label: 'Bidang keahlian' },
              ],
            },
            { name: 'foto', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Narasi',
          fields: [
            {
              name: 'pernyataan',
              type: 'textarea',
              required: true,
              admin: {
                description:
                  'Kalimat utama di bagian atas. Bungkus satu frasa dengan *bintang* agar tampil miring sebagai aksen.',
              },
            },
            {
              name: 'narasi',
              type: 'textarea',
              admin: { description: 'Paragraf yang "terisi tinta" saat di-scroll' },
            },
            { name: 'bahanAjar', type: 'text', admin: { description: 'Catatan bahan ajar' } },
          ],
        },
        {
          label: 'Tautan & kontak',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'sintaId', type: 'text', label: 'SINTA ID' },
                { name: 'scholarId', type: 'text', label: 'Google Scholar user ID' },
              ],
            },
            { name: 'profilFmipa', type: 'text', label: 'URL profil staf FMIPA' },
            { name: 'email', type: 'email' },
            { name: 'alamat', type: 'textarea' },
          ],
        },
      ],
    },
  ],
}
