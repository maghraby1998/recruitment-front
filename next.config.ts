import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["apollo-upload-client"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
    ],
  },
};

export default nextConfig;
