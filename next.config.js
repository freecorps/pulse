/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Opção 1: Permitir qualquer domínio (menos seguro, mas mais conveniente)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],

    // Opção 2: Listar domínios específicos (mais seguro)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cmsassets.rgpub.io',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      // Adicione outros domínios conforme necessário
    ],
  },
}

module.exports = nextConfig 