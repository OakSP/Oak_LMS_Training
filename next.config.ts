import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma and bcrypt must not be bundled by Next.js — run on server only
  serverExternalPackages: ["@prisma/client", "prisma", "bcryptjs", "pg"],

  // Silence "Detected default export without module format" warnings from optional packages
  experimental: {
    optimizePackageImports: ["recharts", "@dnd-kit/core", "@dnd-kit/sortable"],
  },
};

export default nextConfig;
