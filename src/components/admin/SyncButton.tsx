'use client'

import { Button, toast } from '@payloadcms/ui'
import { useState } from 'react'

type Hasil = { sumber: string; status: string; ringkasan: string }

export function SyncButton() {
  const [jalan, setJalan] = useState(false)
  const [hasil, setHasil] = useState<Hasil[]>([])

  const sinkron = async () => {
    setJalan(true)
    try {
      const res = await fetch('/api/sinkron', { method: 'POST', credentials: 'include' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
      setHasil(data)
      const gagal = (data as Hasil[]).some((h) => h.status === 'gagal')
      if (gagal) toast.error('Sebagian sumber gagal. Lihat rinciannya di bawah tombol.')
      else toast.success('Sinkron selesai. Muat ulang halaman untuk melihat angka terbaru.')
    } catch (e) {
      toast.error(`Sinkron gagal: ${e instanceof Error ? e.message : e}`)
    } finally {
      setJalan(false)
    }
  }

  return (
    <div style={{ marginBottom: 'var(--base)' }}>
      <Button onClick={sinkron} disabled={jalan} buttonStyle="primary">
        {jalan ? 'Menyinkronkan, bisa sampai 1 menit…' : 'Sinkronkan sekarang'}
      </Button>
      <ul aria-live="polite" style={{ margin: 0, paddingLeft: '1.2rem' }}>
        {hasil.map((h) => (
          <li key={h.sumber}>
            {h.sumber === 'scholar' ? 'Google Scholar' : 'SINTA'}: {h.status}, {h.ringkasan}
          </li>
        ))}
      </ul>
    </div>
  )
}
