import { Bab } from '@/components/selulosa/Bab'
import { Fokus } from '@/components/selulosa/Fokus'
import { Footer } from '@/components/selulosa/Footer'
import { Header } from '@/components/selulosa/Header'
import { Hero } from '@/components/selulosa/Hero'
import { Hibah } from '@/components/selulosa/Hibah'
import { Kegiatan } from '@/components/selulosa/Kegiatan'
import { Mengajar } from '@/components/selulosa/Mengajar'
import { Profil } from '@/components/selulosa/Profil'
import { Publikasi } from '@/components/selulosa/Publikasi'
import { Roadmap } from '@/components/selulosa/Roadmap'
import { Sorotan } from '@/components/selulosa/Sorotan'
import { ambilData } from '@/lib/data'
import { publikasiKlien, risetKlien, roadmapKlien, temaKlien } from '@/lib/klien'
import { ringkasMengajar } from '@/lib/mengajar'

export const revalidate = 300

export default async function Beranda() {
  const d = await ambilData()
  const ajar = ringkasMengajar(d.mengajar)
  const tahunRoadmap = d.roadmap.map((r) => r.tahun)
  const rentangRoadmap = tahunRoadmap.length
    ? `${Math.min(...tahunRoadmap)}–${Math.max(...tahunRoadmap)}`
    : undefined
  const tahunAjar = ajar.sejak?.match(/\d{4}/)?.[0]

  return (
    <>
      <Header nama={d.profil.nama} />
      <main id="isi">
        <Hero profil={d.profil} metrik={d.metrik} pendidikan={d.pendidikan} />

        <Bab id="profil" nomor="01" label="Profil" judul="Pendidikan dan karier">
          <Profil profil={d.profil} pendidikan={d.pendidikan} riwayat={d.riwayat} />
        </Bab>

        <Bab id="fokus" nomor="02" label="Riset" nada="gelap" judul="Tiga fokus riset">
          <Fokus tema={d.tema} publikasi={d.publikasi} roadmap={d.roadmap} />
        </Bab>

        <Bab
          id="roadmap"
          nomor="03"
          label="Roadmap"
          judul="Perjalanan riset"
          aksen={rentangRoadmap}
        >
          <Roadmap tema={d.tema.map(temaKlien)} roadmap={d.roadmap.map(roadmapKlien)} />
        </Bab>

        <Bab id="hibah" nomor="04" label="Hibah" judul="Penelitian dan pengabdian">
          <Hibah riset={d.riset.map(risetKlien)} />
        </Bab>

        <Bab
          id="publikasi"
          nomor="05"
          label="Publikasi"
          judul="Karya ilmiah"
          aksen={`${d.publikasi.length} judul`}
        >
          <Sorotan publikasi={d.publikasi} />
          <Publikasi publikasi={d.publikasi.map(publikasiKlien)} />
        </Bab>

        <Bab
          id="mengajar"
          nomor="06"
          label="Mengajar"
          judul="Pengalaman mengajar"
          aksen={tahunAjar ? `sejak ${tahunAjar}` : undefined}
        >
          <Mengajar data={ajar} bahanAjar={d.profil.bahanAjar} />
        </Bab>

        <Bab id="kegiatan" nomor="07" label="Kegiatan" judul="Kegiatan terbaru">
          <Kegiatan kegiatan={d.kegiatan} />
        </Bab>
      </main>
      <Footer profil={d.profil} />
    </>
  )
}
