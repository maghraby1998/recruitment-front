import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["apollo-upload-client"],
  images: {
    remotePatterns: [
      {
        protocol: (process.env.IMAGES_PROTOCOL as "http" | "https") || "http",
        hostname: process.env.IMAGES_HOSTNAME || "localhost",
        port: process.env.IMAGES_PORT || "5000",
      },
    ],
  },
};

export default nextConfig;
