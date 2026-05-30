/**
 * Returns true only when DATABASE_URL is set to a real (non-placeholder) connection string.
 * The placeholder URL in prisma.config.ts allows `prisma generate` to work on Vercel
 * without a database, but must not trigger actual DB queries at runtime.
 */
export function isDatabaseConnected(): boolean {
  const url = process.env.DATABASE_URL ?? "";
  return Boolean(url) && !url.includes("placeholder");
}
