/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Use local backend for development, hosted backend for production
    const target = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
    return [
      {
        source: '/api/:path*',
        destination: `${target}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
