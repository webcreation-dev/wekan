/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Modules natifs (libSQL / Turso) : chargés tels quels côté serveur, pas empaquetés
    serverComponentsExternalPackages: ['@libsql/client', 'libsql', '@prisma/adapter-libsql'],
  },
  images: {
    domains: ['images.unsplash.com', 'source.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig
