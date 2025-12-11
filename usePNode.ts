'use client';

/**
 * usePNode Hook
 * Fetches a single pNode by ID from the Edge API with React Query
 */

import { useQuery } from '@tanstack/react-query';
import type { PNode } from '@/lib/xandeum';
import { pnodesKeys } from './usePNodes';

interface UsePNodeOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
}

async function fetchPNode(id: string): Promise<PNode> {
  const response = await fetch(`/api/pnodes/${id}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    
    if (response.status === 404) {
      throw new Error('Node not found');
    }
    
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Hook to fetch a single pNode by ID
 * 
 * @example
 * const { data: node, isLoading, error } = usePNode('node-123');
 */
export function usePNode(id: string | undefined | null, options: UsePNodeOptions = {}) {
  const { enabled = true, refetchInterval = 10_000 } = options;

  return useQuery({
    queryKey: pnodesKeys.detail(id ?? ''),
    queryFn: () => fetchPNode(id!),
    enabled: enabled && !!id,
    staleTime: 10_000,
    refetchInterval: id ? refetchInterval : false,
  });
}

/**
 * Hook to fetch a node with related data
 */
export function usePNodeWithStats(id: string | undefined | null, options: UsePNodeOptions = {}) {
  const query = usePNode(id, options);

  const stats = query.data
    ? {
        isHealthy: query.data.health === 'healthy',
        isDegraded: query.data.health === 'degraded',
        isDown: query.data.health === 'down',
        storagePercent: query.data.storage?.used ?? 0,
        hasHighLatency: query.data.latency > 100,
        hasLowUptime: query.data.uptime < 99,
      }
    : null;

  return {
    ...query,
    node: query.data,
    stats,
  };
}
