/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      ...(process.env.SUPABASE_PROJECT_HOSTNAME ? [{
        protocol: "https",
        hostname: process.env.SUPABASE_PROJECT_HOSTNAME,
      }] : []),
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
}

export default nextConfig
