import { ImageResponse } from 'next/og'

export const alt = 'Heri Satria, Dekan FMIPA Universitas Lampung'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Ambil TTF dari Google Fonts; bila gagal, pakai font bawaan
async function font(keluarga: string) {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${keluarga}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1)' },
    }).then((r) => r.text())
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1]
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : undefined
  } catch {
    return undefined
  }
}

function Heksagon({ isi }: { isi?: boolean }) {
  return (
    <svg width="54" height="62" viewBox="0 0 54 62">
      <path
        d="M27 3 51 17v28L27 59 3 45V17Z"
        fill={isi ? '#c9f36a' : 'none'}
        stroke="#c9f36a"
        strokeWidth="2.5"
      />
    </svg>
  )
}

export default async function GambarOG() {
  const [geist, instrument] = await Promise.all([
    font('Geist:wght@500'),
    font('Instrument+Serif:ital@1'),
  ])
  const fonts = [
    geist && { name: 'Geist', data: geist, style: 'normal' as const, weight: 500 as const },
    instrument && {
      name: 'Instrument',
      data: instrument,
      style: 'italic' as const,
      weight: 400 as const,
    },
  ].filter(Boolean) as {
    name: string
    data: ArrayBuffer
    style: 'normal' | 'italic'
    weight: 400 | 500
  }[]

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        background: '#0c1a14',
        color: '#eef1ea',
        fontFamily: geist ? 'Geist' : 'sans-serif',
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#9aa59d' }}
      >
        <span>DEKAN FMIPA</span>
        <span>UNIVERSITAS LAMPUNG</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 168, lineHeight: 0.85, letterSpacing: -10 }}>Heri Satria</div>
        <div style={{ display: 'flex', marginTop: 34, fontSize: 44, lineHeight: 1.15 }}>
          <span style={{ marginRight: 14 }}>Mengolah</span>
          <span
            style={{
              color: '#c9f36a',
              fontFamily: instrument ? 'Instrument' : 'serif',
              fontStyle: 'italic',
            }}
          >
            limbah pertanian
          </span>
          <span style={{ marginLeft: 14 }}>menjadi bioetanol dan hidrogel.</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 18 }}>
        {[false, false, true, false, false, true, false, false].map((isi, i) => (
          <Heksagon key={i} isi={isi} />
        ))}
      </div>
    </div>,
    { ...size, fonts },
  )
}
