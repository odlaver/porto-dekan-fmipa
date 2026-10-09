// Kunci dedup: judul tanpa tanda baca dan spasi
export const kunciJudul = (judul: string) =>
  judul
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '')
    .slice(0, 160)

// Scholar ikut mendaftar berkas peer review, cek kemiripan, dan potongan judul
export function layakPublikasi(judul: string) {
  const j = judul.trim()
  if (j.length < 25) return false
  if (/\b(peer\s*review|similarity|similirity|turnitin|cek\s*plagiasi)/i.test(j)) return false
  if (/^seminar nasional\b.*\d{4}$/i.test(j)) return false
  // Judul yang isinya hanya daftar nama penulis; regex per bagian agar linear
  const bagian = j.split(',')
  const nama = /^\s*\p{Lu}[\p{L}.'-]*(?:\s+\p{Lu}[\p{L}.'-]*){0,3}\s*$/u
  if (bagian.length >= 2 && bagian.every((b) => nama.test(b))) return false
  return true
}

// Huruf Yunani dari font Symbol tersimpan di area privat Unicode (0xf061 = α)
const SIMBOL: Record<number, string> = {
  0xf061: 'α',
  0xf062: 'β',
  0xf064: 'δ',
  0xf067: 'γ',
  0xf06d: 'μ',
}
export const bersihkanJudul = (judul: string) =>
  Array.from(judul)
    .map((c) => (SIMBOL[c.codePointAt(0)!] ? ` ${SIMBOL[c.codePointAt(0)!]}` : c))
    .join('')
    .replace(/\s{2,}/g, ' ')
    .trim()
