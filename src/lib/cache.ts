import { LRUCache } from "lru-cache";

type CacheEntry = { payload: unknown };

const cache = new LRUCache<string, CacheEntry>({
  max: 100,
  ttl: 1000 * 60 * 20,
});

export const responseCache = {
  get<T>(key: string): T | undefined {
    return cache.get(key)?.payload as T | undefined;
  },
  set<T>(key: string, value: T): void {
    cache.set(key, { payload: value as unknown });
  },
  has(key: string): boolean {
    return cache.has(key);
  },
};
