export const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'

export const jeda = (ms: number) => new Promise((r) => setTimeout(r, ms))

// SINTA memakai titik ribuan: "1.246" berarti 1246
export const angkaId = (s: string) => Number(s.replace(/\./g, '').replace(/[^\d]/g, '')) || 0
