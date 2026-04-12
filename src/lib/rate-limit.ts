// NOTE: In-memory rate limiting is per-instance on serverless. Each cold start
// resets this Map, so limits only catch rapid-fire abuse within a single instance
// lifetime. For production-grade rate limiting, migrate to Upstash Redis
// (@upstash/ratelimit + @upstash/redis). This implementation still catches
// burst abuse within the same warm instance.

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()
const MAX_STORE_SIZE = 10_000

const CLEANUP_INTERVAL = 30_000
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key)
  }
  if (store.size > MAX_STORE_SIZE) {
    const entries = [...store.entries()]
      .sort((a, b) => a[1].resetAt - b[1].resetAt)
    const toRemove = entries.slice(0, store.size - MAX_STORE_SIZE)
    for (const [key] of toRemove) store.delete(key)
  }
}

interface RateLimitOptions {
  maxRequests: number
  windowMs: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  cleanup()

  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs })
    return { success: true, remaining: options.maxRequests - 1, resetAt: now + options.windowMs }
  }

  if (entry.count >= options.maxRequests) {
    return { success: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { success: true, remaining: options.maxRequests - entry.count, resetAt: entry.resetAt }
}

export const LIMITS = {
  login: { maxRequests: 5, windowMs: 10 * 60 * 1000 },
  inquiry: { maxRequests: 3, windowMs: 5 * 60 * 1000 },
  createDeal: { maxRequests: 5, windowMs: 30 * 60 * 1000 },
  createPost: { maxRequests: 10, windowMs: 30 * 60 * 1000 },
  createComment: { maxRequests: 10, windowMs: 30 * 1000 },
  sendMessage: { maxRequests: 20, windowMs: 30 * 1000 },
} as const
