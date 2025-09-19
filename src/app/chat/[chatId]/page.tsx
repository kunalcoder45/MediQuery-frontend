/** @type {import('next').NextConfig} */
const nextConfig = {
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
  async rewrites() {
    return [
      {
        source: '/api/web3forms/:path*',
        destination: 'https://api.web3forms.com/:path*',
      },
      // Agar chat API ko proxy karna hai to ye uncomment kar sakte ho:
      // {
      //   source: '/api/chat/:path*',
      //   destination: 'https://mediquery-chat-server.onrender.com/api/chat/:path*',
      // },
    ];
  },
};

export default nextConfig;
