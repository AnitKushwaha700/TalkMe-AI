/**
 * Simple in-memory rate limiter.
 * For production at scale, swap this out for @upstash/ratelimit with Redis.
 * This works great for single-instance Vercel deployments (free tier).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      if (now > entry.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

interface RateLimitOptions {
  maxRequests: number; // Max requests per window
  windowMs: number; // Window duration in ms
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { maxRequests: 20, windowMs: 24 * 60 * 60 * 1000 }
): RateLimitResult {
  const now = Date.now();
  const existing = rateLimitMap.get(identifier);

  // If no entry or window expired, create new entry
  if (!existing || now > existing.resetAt) {
    const entry: RateLimitEntry = {
      count: 1,
      resetAt: now + options.windowMs,
    };
    rateLimitMap.set(identifier, entry);
    return {
      success: true,
      remaining: options.maxRequests - 1,
      resetAt: entry.resetAt,
    };
  }

  // Increment count
  existing.count++;
  rateLimitMap.set(identifier, existing);

  if (existing.count > options.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  return {
    success: true,
    remaining: options.maxRequests - existing.count,
    resetAt: existing.resetAt,
  };
}
