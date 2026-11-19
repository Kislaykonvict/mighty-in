/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'mightywarner.com',
      },
      {
        protocol: 'https',
        hostname: 'mightywarners.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/assessment',
        destination: '/#growth-tools',
        permanent: true,
      },
      {
        source: '/growth-lab',
        destination: '/#growth-tools',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
