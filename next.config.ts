import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zigskciwdycfpkmnzanc.supabase.co",
      },
    ],
  },
};

export default nextConfig;
