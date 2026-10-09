import * as cheerio from 'cheerio'
import { UA, jeda } from './util'

export type BarisScholar = {
  judul: string
  penulis: string
  venue: string
  tahun?: number
  sitasi: number
  tautan: string
}

export async function ambilScholar(userId: string) {
  const baris: BarisScholar[] = []
  let metrik = { sitasi: 0, hIndex: 0, i10: 0 }

  for (let mulai = 0; mulai < 1000; mulai += 100) {
    const url = `https://scholar.google.com/citations?user=${userId}&hl=en&cstart=${mulai}&pagesize=100`
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'en' },
      signal: AbortSignal.timeout(20_000),
    })
    if (!res.ok) throw new Error(`Google Scholar membalas HTTP ${res.status}`)
    const $ = cheerio.load(await res.text())

    if (mulai === 0) {
      const v = $('#gsc_rsb_st td.gsc_rsb_std')
        .map((_, el) => Number($(el).text()))
        .get()
      // Tanpa tabel metrik biasanya berarti CAPTCHA
      if (v.length < 6)
        throw new Error('Halaman Scholar tidak lengkap, kemungkinan diblokir CAPTCHA')
      metrik = { sitasi: v[0], hIndex: v[2], i10: v[4] }
    }

    const halaman = $('tr.gsc_a_tr')
      .map((_, tr) => {
        const t = $(tr)
        const abu = t.find('.gs_gray')
        const venue = abu.eq(1).clone().children().remove().end().text().trim()
        const tahun = Number(t.find('.gsc_a_h').text().trim())
        return {
          judul: t.find('a.gsc_a_at').text().trim(),
          penulis: abu.eq(0).text().trim(),
          venue,
          tahun: tahun || undefined,
          sitasi: Number(t.find('a.gsc_a_ac').text().replace(/\D/g, '')) || 0,
          tautan: 'https://scholar.google.com' + (t.find('a.gsc_a_at').attr('href') ?? ''),
        }
      })
      .get()
      .filter((b) => b.judul)

    baris.push(...halaman)
    if (halaman.length < 100) break
    await jeda(1500)
  }

  return { metrik: { ...metrik, entri: baris.length }, baris }
}
