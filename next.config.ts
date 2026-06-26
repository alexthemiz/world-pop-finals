import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "world-pop-finals.vercel.app" }],
        destination: "https://triviakicks.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
