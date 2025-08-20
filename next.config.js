/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Force the backend URL - no fallback to localhost
    const target = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://careermate-alcholichut.onrender.com'
    return [
      {
        source: '/api/:path*',
        destination: `${target}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
