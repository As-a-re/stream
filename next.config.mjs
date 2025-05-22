/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'image.tmdb.org',
      'themoviedb.org',
      'via.placeholder.com',
      'example.com',
      'images.unsplash.com',
    ],
    unoptimized: true,
  },
  env: {
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    NEXT_PUBLIC_SUI_NETWORK: process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet',
    NEXT_PUBLIC_SUISTREAM_PACKAGE_ID: process.env.NEXT_PUBLIC_SUISTREAM_PACKAGE_ID,
    NEXT_PUBLIC_SUISTREAM_TREASURY_CAP: process.env.NEXT_PUBLIC_SUISTREAM_TREASURY_CAP,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
