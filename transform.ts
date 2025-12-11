/**
 * Data transformation utilities
 * TODO: Add data transformation logic for pNode data
 */

import { PNode } from './api';

/**
 * Transform raw pNode data for display
 */
export function transformPNodeData(node: PNode): PNode {
  // TODO: Add transformation logic
  return node;
}

/**
 * Format storage size for display
 */
export function formatStorageSize(used: number, total: number, unit: string): string {
  const usedFormatted = used.toFixed(2);
  const totalFormatted = total.toFixed(2);
  return `${usedFormatted} / ${totalFormatted} ${unit}`;
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Format latency for display
 */
export function formatLatency(ms: number): string {
  if (ms < 1000) {
    return `${ms.toFixed(0)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}



