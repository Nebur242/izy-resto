export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function shouldRefresh(lastFetched: number | null): boolean {
  return !lastFetched || Date.now() - lastFetched > CACHE_DURATION;
}