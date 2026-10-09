import type { Publikasi, Riset, Roadmap, TemaRoadmap } from '@/payload-types'
import { hurufJudul, rapikanJudul } from '@/seed/rapikan'

// Hanya field yang dibaca komponen klien, agar payload RSC ramping

export const publikasiKlien = (p: Publikasi) => ({
  id: p.id,
  judul: p.judul,
  tahun: p.tahun ?? null,
  indeks: p.indeks ?? [],
  venue: p.venue ? hurufJudul(p.venue) : null,
  penulis: p.penulis ?? null,
  kuartil: p.kuartil ?? null,
  akreditasi: p.akreditasi ?? null,
  tautan: p.tautan ?? null,
  sitasi: Math.max(p.sitasiScholar ?? 0, p.sitasiScopus ?? 0),
})

export const risetKlien = (r: Riset) => ({
  id: r.id,
  judul: r.judul,
  jenis: r.jenis,
  tahun: r.tahun,
  peran: r.peran ?? null,
  ketua: r.ketua ?? null,
  skema: r.skema ? rapikanJudul(r.skema) : null,
  dana: r.dana ?? null,
})

export const temaKlien = (t: TemaRoadmap) => ({ id: t.id, nama: t.nama })

export const roadmapKlien = (r: Roadmap) => ({
  id: r.id,
  judul: r.judul,
  tahun: r.tahun,
  jenis: r.jenis ?? null,
  keterangan: r.keterangan ?? null,
  rencana: Boolean(r.rencana),
  tema: r.tema && typeof r.tema === 'object' ? temaKlien(r.tema) : null,
})

export type PublikasiKlien = ReturnType<typeof publikasiKlien>
export type RisetKlien = ReturnType<typeof risetKlien>
export type TemaKlien = ReturnType<typeof temaKlien>
export type RoadmapKlien = ReturnType<typeof roadmapKlien>
