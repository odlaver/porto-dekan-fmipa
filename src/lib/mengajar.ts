import type { Mengajar } from '@/payload-types'
import { hurufJudul } from '@/seed/rapikan'

// "2025/2026 Genap" jadi angka urut
export function urutSemester(s: string) {
  const tahun = Number(s.match(/(\d{4})\//)?.[1]) || 0
  const bagian = /genap/i.test(s) ? 1 : /pendek|antara/i.test(s) ? 2 : 0
  return tahun * 3 + bagian
}

export function ringkasMengajar(docs: Mengajar[]) {
  const peta = new Map<
    string,
    { nama: string; kampus: string; kelas: number; semester: string[] }
  >()
  for (const d of docs) {
    const kampus = d.perguruanTinggi ?? 'Universitas Lampung'
    const kunci = `${d.mataKuliah.trim().toLowerCase()}|${kampus}`
    const m = peta.get(kunci) ?? { nama: hurufJudul(d.mataKuliah), kampus, kelas: 0, semester: [] }
    m.kelas++
    m.semester.push(d.semester)
    peta.set(kunci, m)
  }

  const matkul = [...peta.values()]
    .map((m) => {
      const urut = [...new Set(m.semester)].sort((a, b) => urutSemester(a) - urutSemester(b))
      return {
        ...m,
        jumlahSemester: urut.length,
        pertama: urut[0],
        terakhir: urut[urut.length - 1],
      }
    })
    .sort((a, b) => b.kelas - a.kelas || urutSemester(b.terakhir) - urutSemester(a.terakhir))

  const semuaSemester = [...new Set(docs.map((d) => d.semester))].sort(
    (a, b) => urutSemester(a) - urutSemester(b),
  )
  const kampus = [...new Set(matkul.map((m) => m.kampus))]

  return {
    total: docs.length,
    matkul,
    kampus,
    sejak: semuaSemester[0],
    terbaru: semuaSemester.at(-1),
  }
}
