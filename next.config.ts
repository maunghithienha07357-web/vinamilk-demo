import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  async redirects() {
    return [{ source: "/demo/admin/ai", destination: "/demo/superadmin", permanent: false }];
  },
};

export default nextConfig;
