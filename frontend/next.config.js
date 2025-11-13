/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true, // true varsayılan değerdir, bu satırı silebilirim
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  
  // CSS ve external paketler için eklenen ayarlar
  
  // Webpack özelleştirmesi (isteğe bağlı)
  webpack: (config) => {
    // Varolan webpack ayarlarınızı korur
    return config;
  },
}

module.exports = nextConfig