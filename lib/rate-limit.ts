/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Good enough for serverless (per-instance limiting) and catches
 * rapid-fire abuse. For cross-instance limits, swap in Upstash Redis.
 */

const hits = new Map<string, number[]>();

const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, timestamps] of hits) {
    const valid = timestamps.filter((t) => now - t < windowMs);
    if (valid.length === 0) hits.delete(key);
    else hits.set(key, valid);
  }
}

export function rateLimit(
  key: string,
  { maxRequests = 10, windowMs = 60_000 } = {}
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  cleanup(windowMs);

  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (timestamps.length >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return { allowed: true, remaining: maxRequests - timestamps.length };
}
