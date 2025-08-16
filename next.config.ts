/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your other configurations like typescript, eslint, images go here
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // This is the rewrite function
  async rewrites() {
    return [
      {
        source: '/api/web3forms/:path*',
        destination: 'https://api.web3forms.com/:path*',
      },
    ];
  },
};

export default nextConfig;