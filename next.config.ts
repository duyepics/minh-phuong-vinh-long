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
    proxyClientMaxBodySize: "50mb",
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  // Đảm bảo file USDZ được serve với đúng MIME type cho iOS Safari Quick Look AR
  async headers() {
    return [
      {
        source: "/:path*.usdz",
        headers: [
          {
            key: "Content-Type",
            value: "model/vnd.usdz+zip",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
