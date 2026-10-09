import type { Payload } from 'payload'
import { SyncButton } from './SyncButton'
import s from './Ringkasan.module.css'

const tgl = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
      })
    : '-'

const angka = (n?: number | null) => (n == null ? '-' : n.toLocaleString('id-ID'))

// Panel di atas dasbor: angka utama, status sinkron, pintasan, dan isian terbaru
export async function Ringkasan({ payload }: { payload: Payload }) {
  const hitung = (collection: Parameters<Payload['count']>[0]['collection'], where?: object) =>
    payload.count({ collection, where: where as never }).then((r) => r.totalDocs)

  const [
    metrik,
    publikasi,
    penelitian,
    pengabdian,
    kelas,
    kegiatan,
    roadmap,
    log,
    kegiatanBaru,
    publikasiBaru,
  ] = await Promise.all([
    payload.findGlobal({ slug: 'metrik' }),
    hitung('publikasi', { sembunyikan: { not_equals: true } }),
    hitung('riset', { jenis: { equals: 'penelitian' } }),
    hitung('riset', { jenis: { equals: 'pengabdian' } }),
    hitung('mengajar'),
    hitung('kegiatan'),
    hitung('roadmap'),
    payload.find({ collection: 'log-sinkron', sort: '-createdAt', limit: 6, depth: 0 }),
    payload.find({ collection: 'kegiatan', sort: '-tanggal', limit: 5, depth: 0 }),
    payload.find({ collection: 'publikasi', sort: '-updatedAt', limit: 5, depth: 0 }),
  ])

  const terakhir = (sumber: string) => log.docs.find((l) => l.sumber === sumber)

  const utama = [
    ['Sitasi', metrik.scholar?.sitasi, 'Google Scholar'],
    ['h-index', metrik.scholar?.hIndex, 'Google Scholar'],
    ['Skor SINTA', metrik.sinta?.skor, 'SINTA'],
  ] as const

  const jumlah = [
    ['Publikasi', publikasi, '/admin/collections/publikasi'],
    ['Penelitian', penelitian, '/admin/collections/riset'],
    ['Pengabdian', pengabdian, '/admin/collections/riset'],
    ['Kelas mengajar', kelas, '/admin/collections/mengajar'],
    ['Kegiatan', kegiatan, '/admin/collections/kegiatan'],
    ['Titik roadmap', roadmap, '/admin/collections/roadmap'],
  ] as const

  const pintasan = [
    ['Tambah kegiatan', '/admin/collections/kegiatan/create'],
    ['Tambah publikasi', '/admin/collections/publikasi/create'],
    ['Tambah penelitian', '/admin/collections/riset/create'],
    ['Edit profil', '/admin/globals/profil'],
    ['Roadmap', '/admin/collections/roadmap'],
  ] as const

  return (
    <section className={s.ringkasan} aria-labelledby="ringkasan-judul">
      <header className={s.kepala}>
        <p className={s.label}>Dasbor</p>
        <h1 id="ringkasan-judul" className={s.judul}>
          Portofolio Dekan FMIPA
        </h1>
      </header>

      <div className={s.grid}>
        <div className={`${s.petak} ${s.utama}`}>
          <dl className={s.metrik}>
            {utama.map(([label, nilai, sumber]) => (
              <div key={label}>
                <dt className={s.label}>{label}</dt>
                <dd>{angka(nilai)}</dd>
                <span className={s.kecil}>{sumber}</span>
              </div>
            ))}
          </dl>
        </div>

        <div className={`${s.petak} ${s.sinkron}`}>
          <h2 className={s.label}>Sinkron data</h2>
          <ul className={s.status}>
            {(['scholar', 'sinta'] as const).map((sumber) => {
              const l = terakhir(sumber)
              return (
                <li key={sumber}>
                  <span
                    className={s.titik}
                    data-status={l?.status ?? 'kosong'}
                    aria-hidden="true"
                  />
                  <span>
                    <strong>{sumber === 'scholar' ? 'Google Scholar' : 'SINTA'}</strong>
                    <span className={s.kecil}>
                      {l ? `${l.status} · ${tgl(l.createdAt)}` : 'belum pernah'}
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>
          <SyncButton />
        </div>

        <ul className={`${s.petak} ${s.jumlah}`}>
          {jumlah.map(([label, n, url]) => (
            <li key={label}>
              <a href={url}>
                <span className={s.angkaKecil}>{angka(n)}</span>
                <span className={s.kecil}>{label}</span>
              </a>
            </li>
          ))}
        </ul>

        <nav className={`${s.petak} ${s.pintasan}`} aria-label="Pintasan">
          <h2 className={s.label}>Pintasan</h2>
          <ul>
            {pintasan.map(([label, url]) => (
              <li key={url}>
                <a href={url}>{label}</a>
              </li>
            ))}
            <li>
              <a href="/" target="_blank" rel="noopener noreferrer">
                Buka situs ↗
              </a>
            </li>
          </ul>
        </nav>

        <div className={`${s.petak} ${s.daftar}`}>
          <h2 className={s.label}>Kegiatan terbaru</h2>
          <ol>
            {kegiatanBaru.docs.map((k) => (
              <li key={k.id}>
                <a href={`/admin/collections/kegiatan/${k.id}`}>{k.judul}</a>
                <span className={s.kecil}>{tgl(k.tanggal)}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className={`${s.petak} ${s.daftar}`}>
          <h2 className={s.label}>Publikasi terakhir diubah</h2>
          <ol>
            {publikasiBaru.docs.map((p) => (
              <li key={p.id}>
                <a href={`/admin/collections/publikasi/${p.id}`}>{p.judul}</a>
                <span className={s.kecil}>{tgl(p.updatedAt)}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
