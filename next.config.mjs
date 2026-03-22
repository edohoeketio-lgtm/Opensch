/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ['@ffmpeg-installer/ffmpeg'],
    outputFileTracingIncludes: {
      '/api/admin/transcribe': [
        './node_modules/@ffmpeg-installer/**/*'
      ]
    }
  }
};

export default nextConfig;
