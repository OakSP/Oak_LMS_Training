import { defineConfig } from "prisma/config";

// Fallback URL is a valid-format placeholder so `prisma generate` can
// parse it during CI/Vercel builds where DATABASE_URL isn't set yet.
// The app only connects when DATABASE_URL is a non-placeholder value at runtime.
const url = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
  datasource: {
    url,
  },
  migrations: {
    seed: "npx ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
  },
});
