/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental : {
        serverActions : {
            bodySizeLimit : '10mb',
        }
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'assets.example.com',
            port: '',
            pathname: '/account123/**',
          },
        ],
      },
};

export default nextConfig;
