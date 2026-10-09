import * as cheerio from 'cheerio'
import { UA, angkaId, jeda } from './util'

export type BarisScopus = {
  judul: string
  venue: string
  kuartil?: string
  tahun?: number
  sitasi: number
  tautan?: string
}

const BASE = 'https://sinta.kemdiktisaintek.go.id/authors/profile'

async function muat(url: string) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(20_000),
  })
  if (!res.ok) throw new Error(`SINTA membalas HTTP ${res.status}`)
  return cheerio.load(await res.text())
}

export async function ambilSinta(sintaId: string) {
  const $ = await muat(`${BASE}/${sintaId}`)
  const skor = $('.pr-num')
    .map((_, el) => angkaId($(el).text()))
    .get()
  if (!skor.length) throw new Error('Halaman profil SINTA tidak memuat skor')

  // Kolom Scopus di tabel statistik
  const statistik: Record<string, number> = {}
  $('table.stat-table tbody tr').each((_, tr) => {
    const label = $(tr).find('td').first().text().trim().toLowerCase()
    statistik[label] = angkaId($(tr).find('td.text-warning').first().text())
  })

  const baris: BarisScopus[] = []
  const terlihat = new Set<string>()
  // Tanpa login SINTA hanya membuka sebagian halaman
  for (let hal = 1; hal <= 5; hal++) {
    const p = await muat(`${BASE}/${sintaId}?view=scopus&page=${hal}`)
    const item = p('.ar-list-item')
      .map((_, el) => {
        const e = p(el)
        return {
          judul: e.find('.ar-title a').text().replace(/\s+/g, ' ').trim(),
          venue: e.find('.ar-pub').text().trim(),
          kuartil: e.find('.ar-quartile').text().match(/Q\d/)?.[0],
          tahun: angkaId(e.find('.ar-year').text()) || undefined,
          sitasi: angkaId(e.find('.ar-cited').text()),
          tautan: e.find('.ar-title a').attr('href'),
        }
      })
      .get()
      .filter((b) => b.judul && !terlihat.has(b.judul))
    if (!item.length) break
    item.forEach((b) => terlihat.add(b.judul))
    baris.push(...item)
    await jeda(1000)
  }

  return {
    metrik: {
      skor: skor[0],
      skor3th: skor[1],
      artikel: statistik['article'] ?? 0,
      sitasi: statistik['citation'] ?? 0,
      hIndex: statistik['h-index'] ?? 0,
    },
    baris,
  }
}
