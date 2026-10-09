import type { Payload } from 'payload'
import type { Publikasi } from '@/payload-types'
import { bersihkanJudul, kunciJudul, layakPublikasi } from './kunci'
import { ambilScholar } from './scholar'
import { ambilSinta } from './sinta'

type Indeks = NonNullable<Publikasi['indeks']>[number]

type Masukan = {
  judul: string
  indeks: Indeks
  tahun?: number
  venue?: string
  penulis?: string
  tautan?: string
  kuartil?: string
  sitasiScholar?: number
  sitasiScopus?: number
  sumber: string
}

export async function simpanPublikasi(payload: Payload, m: Masukan) {
  m = { ...m, judul: bersihkanJudul(m.judul) }
  const kunci = kunciJudul(m.judul)
  const { docs } = await payload.find({
    collection: 'publikasi',
    where: { kunci: { equals: kunci } },
    limit: 1,
    depth: 0,
  })
  const ada = docs[0]

  if (!ada) {
    await payload.create({
      collection: 'publikasi',
      data: { ...m, indeks: [m.indeks] },
      context: { sinkron: true },
    })
    return 'ditambahkan' as const
  }

  const data: Partial<Publikasi> = {
    indeks: [...new Set([...(ada.indeks ?? []), m.indeks])],
  }
  if (m.sitasiScholar !== undefined) data.sitasiScholar = m.sitasiScholar
  if (m.sitasiScopus !== undefined) data.sitasiScopus = m.sitasiScopus
  // Hasil edit admin dipertahankan
  if (!ada.diubahManual) {
    data.tahun = ada.tahun ?? m.tahun
    data.venue = ada.venue || m.venue
    data.penulis = ada.penulis || m.penulis
    data.tautan = ada.tautan || m.tautan
    data.kuartil = ada.kuartil || m.kuartil
  }
  await payload.update({ collection: 'publikasi', id: ada.id, data, context: { sinkron: true } })
  return 'diperbarui' as const
}

async function catat(
  payload: Payload,
  sumber: 'scholar' | 'sinta',
  kerja: () => Promise<{ ditambahkan: number; diperbarui: number; ringkasan: string }>,
) {
  try {
    const h = await kerja()
    await payload.create({ collection: 'log-sinkron', data: { sumber, status: 'berhasil', ...h } })
    return { sumber, status: 'berhasil', ...h }
  } catch (e) {
    const pesan = e instanceof Error ? e.message : String(e)
    await payload.create({
      collection: 'log-sinkron',
      data: { sumber, status: 'gagal', ringkasan: 'Sinkron gagal', pesan },
    })
    return { sumber, status: 'gagal', ringkasan: pesan, ditambahkan: 0, diperbarui: 0 }
  }
}

export async function jalankanSinkron(payload: Payload) {
  const profil = await payload.findGlobal({ slug: 'profil', depth: 0 })
  const metrik = await payload.findGlobal({ slug: 'metrik', depth: 0 })
  const hasil = []
  const sekarang = new Date().toISOString()

  if (profil.scholarId) {
    const scholarId = profil.scholarId
    hasil.push(
      await catat(payload, 'scholar', async () => {
        const { metrik: m, baris: mentah } = await ambilScholar(scholarId)
        const baris = mentah.filter((b) => layakPublikasi(b.judul))
        let ditambahkan = 0
        let diperbarui = 0
        for (const b of baris) {
          const r = await simpanPublikasi(payload, {
            judul: b.judul,
            indeks: 'scholar',
            tahun: b.tahun,
            venue: b.venue,
            penulis: b.penulis,
            tautan: b.tautan,
            sitasiScholar: b.sitasi,
            sumber: `https://scholar.google.com/citations?user=${scholarId}`,
          })
          if (r === 'ditambahkan') ditambahkan++
          else diperbarui++
        }
        metrik.scholar = { ...m, diperbarui: sekarang }
        return {
          ditambahkan,
          diperbarui,
          ringkasan: `${baris.length} entri layak, ${mentah.length - baris.length} dilewati, ${m.sitasi} sitasi, h-index ${m.hIndex}`,
        }
      }),
    )
  }

  if (profil.sintaId) {
    const sintaId = profil.sintaId
    hasil.push(
      await catat(payload, 'sinta', async () => {
        const { metrik: m, baris } = await ambilSinta(sintaId)
        let ditambahkan = 0
        let diperbarui = 0
        for (const b of baris) {
          const r = await simpanPublikasi(payload, {
            judul: b.judul,
            indeks: 'scopus',
            tahun: b.tahun,
            venue: b.venue,
            kuartil: b.kuartil,
            tautan: b.tautan,
            sitasiScopus: b.sitasi,
            sumber: `https://sinta.kemdiktisaintek.go.id/authors/profile/${sintaId}`,
          })
          if (r === 'ditambahkan') ditambahkan++
          else diperbarui++
        }
        metrik.scopus = { artikel: m.artikel, sitasi: m.sitasi, hIndex: m.hIndex }
        metrik.sinta = { skor: m.skor, skor3th: m.skor3th, diperbarui: sekarang }
        return {
          ditambahkan,
          diperbarui,
          ringkasan: `Skor SINTA ${m.skor}, ${baris.length} artikel Scopus terbaca`,
        }
      }),
    )
  }

  await payload.updateGlobal({
    slug: 'metrik',
    data: { scholar: metrik.scholar, scopus: metrik.scopus, sinta: metrik.sinta },
  })
  return hasil
}
