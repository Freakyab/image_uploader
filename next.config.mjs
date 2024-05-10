/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental : {
        serverActions : {
            bodySizeLimit : '3mb',
        }
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'imageuploaderfreakyab.vercel.app',
           
          },
        ],
      },
};

export default nextConfig;
