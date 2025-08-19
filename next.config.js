/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    const target = process.env.NEXT_PUBLIC_API_BASE_URL
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`
      : 'http://localhost:5000/api/:path*'
    return [
      {
        source: '/api/:path*',
        destination: target,
      },
    ]
  },
}

module.exports = nextConfig
