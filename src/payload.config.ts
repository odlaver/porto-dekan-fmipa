import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { id } from '@payloadcms/translations/languages/id'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pendidikan } from './collections/Pendidikan'
import { Riwayat } from './collections/Riwayat'
import { Riset } from './collections/Riset'
import { Publikasi } from './collections/Publikasi'
import { Mengajar } from './collections/Mengajar'
import { Kegiatan } from './collections/Kegiatan'
import { Roadmap, TemaRoadmap } from './collections/Roadmap'
import { LogSinkron } from './collections/LogSinkron'
import { Profil } from './globals/Profil'
import { Metrik } from './globals/Metrik'
import { jalankanSinkron } from './sync/jalankan'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · Admin Portofolio Dekan',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/ikon.svg' }],
    },
    theme: 'dark',
    components: {
      graphics: {
        Logo: '/components/admin/Merek#Logo',
        Icon: '/components/admin/Merek#Ikon',
      },
      beforeDashboard: ['/components/admin/Ringkasan#Ringkasan'],
      afterNavLinks: ['/components/admin/TautanSitus#TautanSitus'],
    },
  },
  i18n: { supportedLanguages: { id }, fallbackLanguage: 'id' },
  collections: [
    Pendidikan,
    Riwayat,
    Riset,
    Publikasi,
    Mengajar,
    Kegiatan,
    TemaRoadmap,
    Roadmap,
    Media,
    Users,
    LogSinkron,
  ],
  globals: [Profil, Metrik],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  endpoints: [
    {
      path: '/sinkron',
      method: 'post',
      handler: async (req) => {
        if (!req.user) return Response.json({ error: 'Harus masuk sebagai admin' }, { status: 401 })
        return Response.json(await jalankanSinkron(req.payload))
      },
    },
  ],
  jobs: {
    tasks: [
      {
        slug: 'sinkronMingguan',
        schedule: [{ cron: '0 2 * * 1', queue: 'mingguan' }],
        handler: async ({ req }) => {
          await jalankanSinkron(req.payload)
          return { output: {} }
        },
      },
    ],
    autoRun: [{ cron: '*/15 * * * *', queue: 'mingguan' }],
  },
  sharp,
  plugins: [
    // Media di Vercel Blob bila tokennya ada; lokal tetap folder media
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      clientUploads: true,
    }),
  ],
})
