/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed static export since we need server-side features (NextAuth, Prisma)
  // output: 'export',
  // distDir: 'out',
  allowedDevOrigins: ["*.preview.same-app.com"],
  images: {
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
    ],
  },
  // Enable experimental features if needed
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
};

module.exports = nextConfig;
