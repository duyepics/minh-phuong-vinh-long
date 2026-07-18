import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mdcavmuhkpihjqmctekd.supabase.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    middlewareClientMaxBodySize: "50mb",
  },
  serverActions: {
    bodySizeLimit: "50mb",
  },
};

export default nextConfig;
