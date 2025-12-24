/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**', 
      },
    ],
  },
  // Disable problematic source maps in development
  productionBrowserSourceMaps: false,
  
  // Add empty turbopack config to silence the warning
  turbopack: {},
};

export default nextConfig;