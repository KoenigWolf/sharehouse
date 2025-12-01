import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },
  // Faster page loads with compression
  compress: true,
  // Generate ETags for caching
  generateEtags: true,
  // Reduce bundle size
  reactStrictMode: true,
};

export default nextConfig;
