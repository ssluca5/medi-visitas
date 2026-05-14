import { LRUCache } from "lru-cache";

// Cache para dados que mudam pouco (especialidades, subespecialidades)
const staticCache = new LRUCache<string, object>({
  max: 200,
  ttl: 5 * 60 * 1000, // 5 minutos
});

// Cache para dados de dashboard (resumo, métricas)
const dashboardCache = new LRUCache<string, object>({
  max: 100,
  ttl: 60 * 1000, // 60 segundos
});

export function getStaticCache<T>(key: string): T | undefined {
  return staticCache.get(key) as T | undefined;
}

export function setStaticCache(key: string, value: object): void {
  staticCache.set(key, value);
}

export function getDashboardCache<T>(key: string): T | undefined {
  return dashboardCache.get(key) as T | undefined;
}

export function setDashboardCache(key: string, value: object): void {
  dashboardCache.set(key, value);
}

export function invalidateCache(prefix?: string): void {
  if (!prefix) {
    staticCache.clear();
    dashboardCache.clear();
    return;
  }
  for (const key of staticCache.keys()) {
    if (key.startsWith(prefix)) staticCache.delete(key);
  }
  for (const key of dashboardCache.keys()) {
    if (key.startsWith(prefix)) dashboardCache.delete(key);
  }
}
