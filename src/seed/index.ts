import crypto from 'crypto'
import type { CollectionSlug, Payload } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'
import data from './dekan.json' with { type: 'json' }
import { rapikanJudul } from './rapikan'
import type { Publikasi } from '@/payload-types'

type Indeks = NonNullable<Publikasi['indeks']>[number]

const PETA_INDEKS: Record<string, Indeks> = {
  Scopus: 'scopus',
  'Web of Science': 'wos',
  'WOS.SCI': 'wos',
  'WOS.ESCI': 'wos',
  Garuda: 'garuda',
  'Google Scholar': 'scholar',
  PDDikti: 'pddikti',
}

const rupiah = (s?: string) => (s ? Number(s.replace(/[^\d]/g, '')) || undefined : undefined)
const peran = (s?: string) => (s ? (s.toLowerCase() as 'ketua' | 'anggota') : undefined)

async function kosongkan(payload: Payload, slug: CollectionSlug) {
  await payload.delete({ collection: slug, where: { id: { exists: true } } })
}

async function unggahDariUrl(payload: Payload, url: string, alt: string) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!res.ok) return undefined
    const buf = Buffer.from(await res.arrayBuffer())
    const ext = (res.headers.get('content-type')?.split('/')[1] ?? 'jpg').split(';')[0]
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: buf,
        mimetype: res.headers.get('content-type') ?? 'image/jpeg',
        name: `${crypto.randomUUID()}.${ext === 'jpeg' ? 'jpg' : ext}`,
        size: buf.length,
      },
    })
    return doc.id
  } catch {
    return undefined
  }
}

// Foto artikel FMIPA ditanam sebagai base64 di isi berita
async function fotoBerita(payload: Payload, halaman: string, alt: string) {
  try {
    const html = await (await fetch(halaman, { headers: { 'User-Agent': 'Mozilla/5.0' } })).text()
    const m = html.match(/src=["']data:image\/(jpeg|jpg|png|webp);base64,([^"']+)/i)
    if (!m) return undefined
    const buf = Buffer.from(m[2], 'base64')
    const ext = m[1] === 'jpeg' ? 'jpg' : m[1]
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: buf,
        mimetype: `image/${m[1]}`,
        name: `${crypto.randomUUID()}.${ext}`,
        size: buf.length,
      },
    })
    return doc.id
  } catch {
    return undefined
  }
}

async function seed() {
  const payload = await getPayload({ config })
  const p = data.profile

  for (const slug of [
    'pendidikan',
    'riwayat',
    'riset',
    'publikasi',
    'mengajar',
    'kegiatan',
    'roadmap',
    'tema-roadmap',
    'media',
  ] as CollectionSlug[]) {
    await kosongkan(payload, slug)
  }

  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@porto-dekan.local'
  const { totalDocs } = await payload.count({ collection: 'users' })
  if (!totalDocs) {
    const password = process.env.SEED_ADMIN_PASSWORD ?? crypto.randomBytes(9).toString('base64url')
    await payload.create({ collection: 'users', data: { email, password } })
    payload.logger.info(`Admin dibuat: ${email} / ${password} (segera ganti)`)
  }

  const foto = await unggahDariUrl(
    payload,
    'https://fmipa.unila.ac.id/storage/pegawai/1.png',
    'Foto resmi Dr. Eng. Heri Satria dari situs FMIPA Unila',
  )

  await payload.updateGlobal({
    slug: 'profil',
    data: {
      gelarDepan: 'Dr. Eng.',
      nama: 'Heri Satria',
      gelarBelakang: 'S.Si., M.Si.',
      jabatan: 'Dekan Fakultas Matematika dan Ilmu Pengetahuan Alam, Universitas Lampung',
      periode: '2024–2028',
      jurusan: 'Kimia',
      jabatanFungsional: p.jabatanFungsional,
      nip: p.nip,
      nidn: p.nidn,
      bidang: 'Biokimia',
      foto,
      pernyataan:
        'Mengolah *limbah pertanian* menjadi bioetanol dan hidrogel.',
      narasi:
        'Lulus S1 Kimia Universitas Lampung (1995), S2 Bioteknologi IPB (2008), dan S3 Kanazawa University, Jepang (2017) dengan Dean Award. Pernah menjadi Kepala Laboratorium Biokimia dan Wakil Dekan Bidang Akademik dan Kerja Sama, lalu menjabat Dekan FMIPA Universitas Lampung sejak Maret 2024.',
      bahanAjar: data.teachingSummaryUnila.bahanAjar,
      sintaId: p.sintaId,
      scholarId: p.scholarUserId,
      profilFmipa: 'https://fmipa.unila.ac.id/profil-staff/197110012005011002',
      alamat:
        'Gedung Dekanat FMIPA Universitas Lampung\nJl. Prof. Dr. Ir. Sumantri Brojonegoro No. 1\nBandar Lampung 35145',
    },
  })

  const m = data.metrics
  await payload.updateGlobal({
    slug: 'metrik',
    data: {
      scholar: {
        sitasi: m.googleScholar.citationsAll,
        hIndex: m.googleScholar.hIndexAll,
        i10: m.googleScholar.i10IndexAll,
        entri: m.googleScholar.jumlahEntriProfil,
        diperbarui: m.googleScholar.diaksesTanggal,
      },
      scopus: {
        artikel: m.sinta.scopus.articles,
        sitasi: m.sinta.scopus.citations,
        hIndex: m.sinta.scopus.hIndex,
      },
      sinta: {
        skor: m.sinta.sintaScoreOverall,
        skor3th: m.sinta.sintaScore3Yr,
        diperbarui: m.sinta.diaksesTanggal,
      },
    },
  })

  for (const e of data.education) {
    await payload.create({
      collection: 'pendidikan',
      data: {
        jenjang: e.jenjang as 'S1' | 'S2' | 'S3',
        perguruanTinggi: e.perguruanTinggi.replace('UNiversity', 'University'),
        programStudi: e.programStudi,
        gelar: e.gelar,
        tahunMasuk: e.tahunMasuk ?? undefined,
        tahunLulus: e.tahunLulus,
        negara: e.perguruanTinggi.startsWith('Kanazawa') ? 'Jepang' : 'Indonesia',
        sumber: e.source,
      },
    })
  }

  const tahunAwal = (s: string) => Number(s.match(/\d{4}/)?.[0]) || undefined
  const riwayat = [
    ...data.career.map((c) => ({
      nama: c.jabatan,
      jenis: 'jabatan',
      periode: c.periode,
      source: c.source,
    })),
    ...data.organizations.map((o) => ({
      nama: o.nama,
      jenis: 'organisasi',
      periode: o.periode,
      source: o.source,
    })),
    ...data.awards.map((a) => ({
      nama: a.nama,
      jenis: 'penghargaan',
      periode: String(a.tahun),
      source: a.source,
    })),
    ...data.trainingsAndTalks.map((t) => ({
      nama: t.kegiatan,
      jenis: 'pelatihan',
      periode: String(t.tahun),
      source: t.source,
    })),
  ]
  for (const r of riwayat) {
    await payload.create({
      collection: 'riwayat',
      data: {
        nama: r.nama,
        jenis: r.jenis as 'jabatan',
        periode: r.periode.replace(' (periode 2024–2028)', ''),
        tahunMulai: tahunAwal(r.periode),
        sumber: r.source,
      },
    })
  }

  const riset = [
    ...data.research.map((r) => ({ ...r, jenisRiset: 'penelitian' as const })),
    ...data.communityService.map((r) => ({ ...r, jenisRiset: 'pengabdian' as const })),
  ]
  for (const r of riset) {
    const x = r as typeof r & {
      ketua?: string
      anggota?: string[]
      peran?: string
      skema?: string
      dana?: string
    }
    await payload.create({
      collection: 'riset',
      data: {
        judul: rapikanJudul(x.judul),
        jenis: x.jenisRiset,
        tahun: x.tahun,
        peran: peran(x.peran),
        ketua: x.ketua,
        anggota: x.anggota?.join(', '),
        skema: x.skema?.replace(/\s*\(.*\)\s*$/, ''),
        dana: rupiah(x.dana),
        sumber: x.source,
      },
    })
  }

  for (const pub of data.publications) {
    const x = pub as typeof pub & Record<string, unknown>
    const indeks = [...new Set((x.indeks as string[]).map((i) => PETA_INDEKS[i]).filter(Boolean))]
    await payload.create({
      collection: 'publikasi',
      context: { sinkron: true },
      data: {
        judul: rapikanJudul(x.judul),
        tahun: x.tahun,
        indeks,
        venue: (x.venue as string) || undefined,
        penulis: (x.penulis as string) ?? (x.creatorScopus as string),
        kuartil: (x.kuartil as string)?.match(/Q\d/)?.[0],
        akreditasi: x.akreditasi as string,
        doi: x.doi as string,
        tautan: x.link as string,
        sitasiScholar: x.sitasiScholar as number,
        sitasiScopus: x.sitasiScopus as number,
        perluVerifikasi: Boolean(x.perluVerifikasi),
        catatan: x.catatanVerifikasi as string,
        sumber: x.source,
      },
    })
  }

  for (const t of data.teaching) {
    await payload.create({
      collection: 'mengajar',
      data: {
        mataKuliah: t.mataKuliah,
        semester: t.semester,
        kode: t.kodeMatkul,
        kelas: t.kelas.trim(),
        perguruanTinggi: t.perguruanTinggi,
        sumber: t.source,
      },
    })
  }

  const kegiatan = [...data.activities, ...data.activitiesBefore2025]
  for (const k of kegiatan) {
    const x = k as typeof k & { tanggalKegiatan?: string }
    const gambar = await fotoBerita(payload, x.source, x.judul)
    await payload.create({
      collection: 'kegiatan',
      data: {
        judul: x.judul,
        tanggal: x.tanggalKegiatan || x.tanggalTerbit,
        ringkasan: x.ringkasan,
        gambar,
        sumber: x.source,
      },
    })
  }

  const tema: Record<string, number> = {}
  for (const [i, [kunci, nama, warna, deskripsi, kataKunci]] of [
    [
      'enzim',
      'Enzim dan biokatalis',
      'hijau',
      'Memproduksi, memurnikan, dan menstabilkan α-amilase dari bakteri lokal dan Aspergillus fumigatus, antara lain lewat imobilisasi pada bentonit dan kitin.',
      'amylase, amilase, lipase, cellulase, enzyme, enzim',
    ],
    [
      'bioenergi',
      'Bioetanol dari lignoselulosa',
      'amber',
      'Memecah biomassa seperti jerami padi dengan cairan ionik dan enzim dari aktinomisetes lokal, lalu mengubahnya menjadi etanol.',
      'ionic liquid, cairan ionik, lignocellulos, lignoselulos, bioethanol, bioetanol, etanol, ethanol, rice straw, jerami, pretreatment',
    ],
    [
      'hidrogel',
      'Hidrogel selulosa',
      'biru',
      'Mengolah selulosa dari limbah nanas dan singkong menjadi hidrogel penyerap untuk sistem penghantaran obat.',
      'hydrogel, hidrogel, cellulose hydrogel, cassava, singkong, pineapple',
    ],
  ].entries()) {
    const d = await payload.create({
      collection: 'tema-roadmap',
      data: { nama, warna: warna as 'hijau', urutan: i, deskripsi, kataKunci },
    })
    tema[kunci] = d.id
  }

  const titik = [
    [
      2017,
      'bioenergi',
      'Publikasi, J. Am. Chem. Soc.',
      'Kanazawa University',
      'Design of wall-destructive but membrane-compatible solvents',
    ],
    [
      2020,
      'enzim',
      'Publikasi',
      '',
      'Enzymatic Conversion of Potato Starch into Glucose using The purified α-Amylase Enzyme from Locale Isolate Bacteria Bacillus subtillis ITBCCB148',
    ],
    [
      2021,
      'enzim',
      'Publikasi',
      '',
      'Production, purification and characterization of the α-amylase from local bacteria isolate Bacillus subtilis ITBCCB148',
    ],
    [
      2022,
      'enzim',
      'Publikasi Scopus Q3',
      '',
      'The Stability Improvement of α-Amylase Enzyme from Aspergillus fumigatus by Immobilization on a Bentonite Matrix',
    ],
    [
      2023,
      'enzim',
      'Publikasi Scopus Q3',
      '',
      'The stability increase of α-amylase enzyme from Aspergillus fumigatus using dimethyladipimidate',
    ],
    [
      2023,
      'bioenergi',
      'Prosiding Scopus',
      '',
      'Simultaneous bioconversion of rice straw into an intermediate product using ionic liquid and native extracellular hydrolytic enzyme from indigenous actinomycetes',
    ],
    [
      2024,
      'bioenergi',
      'Penelitian, ketua',
      'DIPA FMIPA',
      'Pengembangan biopretreatment dalam produksi bioetanol memanfaatkan limbah padat pertanian dan ekstraselular hidrolitik enzim dari isolat indigenous actinomycetes terpilih',
    ],
    [
      2025,
      'bioenergi',
      'Penelitian, ketua',
      'DIPA LPPM',
      'Biokonversi biomass lignoselulose terpretreatment asam lemah menjadi etanol dengan memanfaatkan agent hydrolysis enzymatic actinomycetes lokal',
    ],
    [
      2025,
      'hidrogel',
      'Publikasi Scopus Q2',
      '',
      'Pineapple Waste Cellulose Hydrogel: A Sustainable Absorbent for Drug Delivery System',
    ],
    [
      2026,
      'hidrogel',
      'Publikasi Scopus Q2',
      '',
      'Beyond Waste: Unlocking the Potential of Cassava Byproducts for Biomedical Hydrogels with Effective Drug Delivery Capabilities',
    ],
    [
      2026,
      'hidrogel',
      'Penelitian, ketua',
      'DIPA BLU FMIPA',
      'Rekayasa sintesis nano-hidrogel berbasis selulosa dari limbah pertanian',
    ],
  ] as const
  for (const [tahun, t, jenis, keterangan, judul] of titik) {
    await payload.create({
      collection: 'roadmap',
      data: { tahun, tema: tema[t], jenis, keterangan: keterangan || undefined, judul },
    })
  }

  payload.logger.info('Seed selesai')
  process.exit(0)
}

await seed()
