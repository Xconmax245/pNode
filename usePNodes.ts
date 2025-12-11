'use client';

/**
 * usePNodes Hook
 * Fetches all pNodes from the Edge API with React Query
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import type { PNode, PNodeListResponse, PNodeHealth } from '@/lib/xandeum';

// Query keys for cache management
export const pnodesKeys = {
  all: ['pnodes'] as const,
  list: (filters?: { health?: PNodeHealth }) =>
    filters ? [...pnodesKeys.all, 'list', filters] : [...pnodesKeys.all, 'list'],
  detail: (id: string) => [...pnodesKeys.all, 'detail', id] as const,
};

interface UsePNodesOptions {
  health?: PNodeHealth;
  enabled?: boolean;
  refetchInterval?: number | false;
}

async function fetchPNodes(health?: PNodeHealth): Promise<PNodeListResponse> {
  const url = new URL('/api/pnodes', window.location.origin);
  if (health) {
    url.searchParams.set('health', health);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Hook to fetch all pNodes
 * 
 * @example
 * const { data, isLoading, error } = usePNodes();
 * const { data } = usePNodes({ health: 'healthy' });
 */
export function usePNodes(options: UsePNodesOptions = {}) {
  const { health, enabled = true, refetchInterval = 10_000 } = options;

  return useQuery({
    queryKey: pnodesKeys.list(health ? { health } : undefined),
    queryFn: () => fetchPNodes(health),
    enabled,
    staleTime: 10_000,
    refetchInterval,
    select: (data) => ({
      nodes: data.nodes ?? [],
      total: data.total ?? 0,
      lastUpdated: data.lastUpdated ?? new Date().toISOString(),
    }),
  });
}

/**
 * Hook to get just the nodes array
 */
export function usePNodesList(options: UsePNodesOptions = {}) {
  const query = usePNodes(options);
  return {
    ...query,
    nodes: query.data?.nodes ?? [],
    total: query.data?.total ?? 0,
  };
}

/**
 * Hook to get health counts
 */
export function usePNodesHealthCounts() {
  const { data, ...rest } = usePNodes();

  const counts = {
    total: data?.total ?? 0,
    healthy: data?.nodes?.filter((n) => n.health === 'healthy').length ?? 0,
    degraded: data?.nodes?.filter((n) => n.health === 'degraded').length ?? 0,
    down: data?.nodes?.filter((n) => n.health === 'down').length ?? 0,
  };

  return { counts, ...rest };
}

/**
 * Hook to get network statistics
 */
export function usePNodesStats() {
  const { data, ...rest } = usePNodes();

  const stats = {
    totalNodes: data?.total ?? 0,
    avgLatency: data?.nodes?.length
      ? Math.round(data.nodes.reduce((sum, n) => sum + n.latency, 0) / data.nodes.length)
      : 0,
    avgUptime: data?.nodes?.length
      ? Number((data.nodes.reduce((sum, n) => sum + n.uptime, 0) / data.nodes.length).toFixed(2))
      : 0,
    avgStorageUsed: data?.nodes?.length
      ? Math.round(data.nodes.reduce((sum, n) => sum + (n.storage?.used ?? 0), 0) / data.nodes.length)
      : 0,
  };

  return { stats, ...rest };
}
