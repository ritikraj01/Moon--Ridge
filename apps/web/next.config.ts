import type { NextConfig } from "next";

const apiHostname = process.env.NEXT_PUBLIC_BASE_URL
  ? new URL(process.env.NEXT_PUBLIC_BASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
      ...(apiHostname && apiHostname !== "localhost"
        ? [{ protocol: "https" as const, hostname: apiHostname }]
        : []),
    ],
  },
};

export default nextConfig;
