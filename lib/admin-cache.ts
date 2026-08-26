import { getCached, CACHE_TTL } from './cache'

// Short-term cache untuk admin (10 detik)
// Data yang jarang berubah tapi perlu fresh
const ADMIN_CACHE_TTL = 10 // 10 detik

export const adminCacheKeys = {
  categories: () => 'admin:categories',
  users: () => 'admin:users:list',
  siteSettings: () => 'admin:settings',
  tags: () => 'admin:tags',
  menus: () => 'admin:menus',
  socialMedia: () => 'admin:social-media',
}

// Cache wrapper untuk admin dengan TTL pendek
export async function getAdminCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = ADMIN_CACHE_TTL
): Promise<T> {
  return getCached(key, fetcher, ttl)
}
