/**
 * API Client for pNodes
 * Updated to fetch from Edge API (which proxies to Xandeum pRPC)
 */

const API_BASE_URL = '/api/pnodes';

export interface PNode {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    city?: string;
    country?: string;
  };
  health: 'healthy' | 'degraded' | 'down';
  storage: {
    used: number;
    total: number;
    unit: 'GB' | 'TB';
  };
  latency: number;
  uptime: number;
  lastSeen: string;
  score?: number;
}

export interface PNodeListResponse {
  nodes: PNode[];
  total: number;
  lastUpdated: string;
}

/**
 * Fetch all pNodes from the Edge API
 */
export async function fetchPNodes(health?: 'healthy' | 'degraded' | 'down'): Promise<PNodeListResponse> {
  try {
    const url = typeof window !== 'undefined'
      ? new URL(API_BASE_URL, window.location.origin)
      : new URL(API_BASE_URL, 'http://localhost:3000');

    if (health) {
      url.searchParams.set('health', health);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 10 }, // ISR: revalidate every 10 seconds
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: PNodeListResponse = await response.json();

    return {
      nodes: data.nodes ?? [],
      total: data.total ?? data.nodes?.length ?? 0,
      lastUpdated: data.lastUpdated ?? new Date().toISOString(),
    };
  } catch (error: unknown) {
    console.error('Error fetching pNodes:', error);
    // Return empty response on error so UI doesn't break
    return {
      nodes: [],
      total: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Fetch a single pNode by ID from the Edge API
 */
export async function fetchPNodeById(id: string): Promise<PNode | null> {
  try {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}${API_BASE_URL}/${id}`
      : `http://localhost:3000${API_BASE_URL}/${id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 10 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: PNode = await response.json();
    return data;
  } catch (error: unknown) {
    console.error(`Error fetching pNode ${id}:`, error);
    return null;
  }
}

/**
 * Get health summary counts
 */
export async function fetchHealthSummary(): Promise<{
  total: number;
  healthy: number;
  degraded: number;
  down: number;
}> {
  const { nodes, total } = await fetchPNodes();

  return {
    total,
    healthy: nodes.filter((n) => n.health === 'healthy').length,
    degraded: nodes.filter((n) => n.health === 'degraded').length,
    down: nodes.filter((n) => n.health === 'down').length,
  };
}

/**
 * Get network statistics
 */
export async function fetchNetworkStats(): Promise<{
  totalNodes: number;
  avgLatency: number;
  avgUptime: number;
  avgStorageUsed: number;
}> {
  const { nodes, total } = await fetchPNodes();

  if (nodes.length === 0) {
    return {
      totalNodes: 0,
      avgLatency: 0,
      avgUptime: 0,
      avgStorageUsed: 0,
    };
  }

  return {
    totalNodes: total,
    avgLatency: Math.round(nodes.reduce((sum, n) => sum + n.latency, 0) / nodes.length),
    avgUptime: Number((nodes.reduce((sum, n) => sum + n.uptime, 0) / nodes.length).toFixed(2)),
    avgStorageUsed: Math.round(nodes.reduce((sum, n) => sum + (n.storage?.used ?? 0), 0) / nodes.length),
  };
}
