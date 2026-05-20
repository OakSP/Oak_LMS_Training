// Upstash Redis — install `@upstash/redis` and set UPSTASH_REDIS_URL + UPSTASH_REDIS_TOKEN to enable
/* eslint-disable @typescript-eslint/no-explicit-any */

const hasRedis = Boolean(
  process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN
);

type CacheValue = string | number | boolean | object | null;

async function getRedis() {
  // @ts-ignore — install `@upstash/redis` when credentials are available
  const { Redis } = await import("@upstash/redis");
  return new Redis({
    url: process.env.UPSTASH_REDIS_URL!,
    token: process.env.UPSTASH_REDIS_TOKEN!,
  });
}

export async function cacheGet(key: string): Promise<CacheValue> {
  if (!hasRedis) return null;
  const redis = await getRedis();
  return (redis as any).get(key);
}

export async function cacheSet(
  key: string,
  value: CacheValue,
  ttlSeconds = 300
): Promise<void> {
  if (!hasRedis) return;
  const redis = await getRedis();
  await (redis as any).set(key, value, { ex: ttlSeconds });
}

export async function cacheDel(key: string): Promise<void> {
  if (!hasRedis) return;
  const redis = await getRedis();
  await (redis as any).del(key);
}

export async function cacheInvalidatePattern(pattern: string): Promise<void> {
  if (!hasRedis) return;
  const redis = await getRedis();
  const keys = await (redis as any).keys(pattern);
  if (keys.length > 0) await (redis as any).del(...keys);
}
