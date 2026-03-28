export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; delay?: number } = {}
): Promise<T> {
  const { retries = 2, delay = 1000 } = options

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt === retries) throw err
      await new Promise((r) => setTimeout(r, delay * (attempt + 1)))
    }
  }

  throw new Error("Unexpected: retries exhausted")
}
