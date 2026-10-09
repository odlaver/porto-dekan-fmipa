import config from '@payload-config'
import { getPayload } from 'payload'

export async function ambilData() {
  const payload = await getPayload({ config })
  const semua = { limit: 1000, pagination: false, depth: 1 } as const

  const [profil, metrik, pendidikan, riwayat, riset, publikasi, mengajar, kegiatan, tema, roadmap] =
    await Promise.all([
      payload.findGlobal({ slug: 'profil', depth: 1 }),
      payload.findGlobal({ slug: 'metrik' }),
      payload.find({ collection: 'pendidikan', ...semua, sort: '-tahunLulus' }),
      payload.find({ collection: 'riwayat', ...semua, sort: '-tahunMulai' }),
      payload.find({ collection: 'riset', ...semua, sort: '-tahun' }),
      payload.find({
        collection: 'publikasi',
        ...semua,
        sort: '-tahun',
        where: {
          and: [{ sembunyikan: { not_equals: true } }, { perluVerifikasi: { not_equals: true } }],
        },
      }),
      payload.find({ collection: 'mengajar', ...semua }),
      payload.find({
        collection: 'kegiatan',
        ...semua,
        sort: '-tanggal',
        where: { tampil: { equals: true } },
      }),
      payload.find({ collection: 'tema-roadmap', ...semua, sort: 'urutan' }),
      payload.find({ collection: 'roadmap', ...semua, sort: 'tahun' }),
    ])

  return {
    profil,
    metrik,
    pendidikan: pendidikan.docs,
    riwayat: riwayat.docs,
    riset: riset.docs,
    publikasi: publikasi.docs,
    mengajar: mengajar.docs,
    kegiatan: kegiatan.docs,
    tema: tema.docs,
    roadmap: roadmap.docs,
  }
}

export type Data = Awaited<ReturnType<typeof ambilData>>

export { angka, gambarDari, media, tanggal, tgl } from './format'
