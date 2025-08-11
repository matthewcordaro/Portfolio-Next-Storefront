/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: process.env.SUPABASE_PROJECT_HOSTNAME,
      },
    ],
  },
}

export default nextConfig
