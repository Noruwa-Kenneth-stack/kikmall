/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'example.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com' // ✅ Google profile pictures
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com' // ✅ Facebook profile pictures
      },
      {
        protocol: 'https',
        hostname: 'graph.facebook.com' // ✅ Facebook API pictures
      },
       {
        protocol: "https",
        hostname: "picsum.photos",
      }
    ]
  }
}

module.exports = nextConfig
