type RateBucket = { count: number; resetAt: number };

type AnalyticsRateLimitGlobal = typeof globalThis & {
  __ainextAnalyticsRateLimits?: Map<string, RateBucket>;
};

const globalStore = globalThis as AnalyticsRateLimitGlobal;
const buckets = globalStore.__ainextAnalyticsRateLimits ??= new Map<string, RateBucket>();

export function allowAnalyticsRequest(key: string, limit = 60, windowMs = 60_000) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
  } else {
    current.count += 1;
    if (current.count > limit) return false;
  }

  if (buckets.size > 5_000) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
  }
  return true;
}
