// Judul SINTA/PDDikti sering ditulis KAPITAL SEMUA
const SINGKATAN = new Set([
  'ACS',
  'IOP',
  'AIP',
  'RSC',
  'IEEE',
  'MDPI',
  'IJCE',
  'JPKM',
  'PPID',
  'UMKM',
  'SD',
  'SMP',
  'SMA',
  'SMK',
  'FMIPA',
  'MIPA',
  'UV',
  'VIS',
  'IR',
  'UV-VIS-IR',
  'RT',
  'RW',
  'KKN',
  'HKI',
  'LPDP',
  'DNA',
  'PKM',
  'BLU',
  'LPPM',
  'DIPA',
  'IV',
  'II',
  'III',
  'NPK',
  'COVID-19',
  'YOLOV5',
  'IPA',
  'TK',
  'PAUD',
  'BUMDES',
  'UIN',
  'ICT',
  'PT',
  'CV',
  'KTH',
  'TPA',
])

const NAMA_DIRI: Record<string, string> = Object.fromEntries(
  [
    'Lampung',
    'Indonesia',
    'Unila',
    'Pseudomonas',
    'Aspergillus',
    'Bacillus',
    'Arduino',
    'Uno',
    'Kanan',
    'Way',
    'Tuba',
    'Malaysia',
    'Prancis',
    'Perancis',
    'Lyon',
    'Islam',
    'Jepang',
    'Pampangan',
    'Rejomulyo',
    'Batanghari',
    'Mesuji',
    'Microsoft',
    'Word',
    'Excel',
    'Kanazawa',
    'Bogor',
    'Sumatera',
    'Selatan',
    'Barat',
    'Timur',
    'Utara',
    'Pesawaran',
    'Tanggamus',
    'Pringsewu',
    'Metro',
    'Natar',
    'Bandar',
    'Gunung',
    'Labuhan',
    'Sains',
    'Universiti',
    'Etawa',
    'Escherichia',
    'Staphylococcus',
    'Saccharomyces',
    'Trichoderma',
    'Streptomyces',
  ].map((n) => [n.toLowerCase(), n]),
)

export function rapikanJudul(judul: string) {
  const huruf = judul.replace(/[^A-Za-z]/g, '')
  if (!huruf || huruf !== huruf.toUpperCase()) return judul.trim()

  let awal = true
  return judul
    .trim()
    .split(/(\s+)/)
    .map((kata) => {
      if (/^\s+$/.test(kata)) return kata
      const inti = kata.replace(/^[("'“]+|[)"'”:;,.]+$/g, '')
      const kecil = inti.toLowerCase()
      let hasil = SINGKATAN.has(inti)
        ? kata
        : NAMA_DIRI[kecil]
          ? kata.toLowerCase().replace(kecil, NAMA_DIRI[kecil])
          : kata.toLowerCase()
      if (awal && !SINGKATAN.has(inti)) hasil = hasil.replace(/\p{L}/u, (c) => c.toUpperCase())
      awal = /[:.]$/.test(kata)
      return hasil
    })
    .join('')
    .replace(/universitas (?=Lampung|Sains)/g, 'Universitas ')
    .replace(/sekolah dasar negeri/g, 'Sekolah Dasar Negeri')
}

// Nama mata kuliah KAPITAL jadi Huruf Judul
const KATA_SAMBUNG = new Set([
  'dan', 'di', 'ke', 'dari', 'untuk', 'pada', 'dalam', 'yang', 'serta',
  'of', 'the', 'and', 'in', 'for', 'on', 'at', 'to', 'a', 'an',
])
export function hurufJudul(teks: string) {
  const huruf = teks.replace(/[^A-Za-z]/g, '')
  if (!huruf || huruf !== huruf.toUpperCase()) return teks.trim()
  return teks
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((k, i) =>
      SINGKATAN.has(k.toUpperCase()) && k.length <= 4 && !/^(dan|di|ke)$/.test(k)
        ? k.toUpperCase()
        : i > 0 && KATA_SAMBUNG.has(k)
          ? k
          : k.replace(/\p{L}/u, (c) => c.toUpperCase()),
    )
    .join(' ')
}
