import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  devIndicators: false,
  // CSS kecil, disisipkan agar tidak memblokir render
  experimental: { inlineCss: true },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    // Di hosting CloudLinux node_modules berupa symlink ke luar proyek
    root: process.env.TURBOPACK_ROOT ?? path.resolve(dirname),
  },
}

const config = withPayload(nextConfig, { devBundleServerPackages: false })
const headersPayload = config.headers

// Critical-CH memaksa Chrome mengulang navigasi; cukup untuk admin
export default {
  ...config,
  headers: async () =>
    (await headersPayload!()).map((aturan) =>
      aturan.headers.some((h) => h.key === 'Critical-CH')
        ? { ...aturan, source: '/admin/:path*' }
        : aturan,
    ),
} satisfies NextConfig
