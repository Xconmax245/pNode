/**
 * Scoring algorithms for pNodes
 * TODO: Implement comprehensive scoring logic
 */

import { PNode } from './api';

export interface NodeScore {
  overall: number;
  health: number;
  performance: number;
  storage: number;
  reliability: number;
}

/**
 * Calculate overall score for a pNode
 */
export function calculateNodeScore(node: PNode): NodeScore {
  // Health score (0-100)
  const healthScore = getHealthScore(node.health);
  
  // Performance score based on latency (0-100)
  const performanceScore = getPerformanceScore(node.latency);
  
  // Storage score based on available space (0-100)
  const storageScore = getStorageScore(node.storage);
  
  // Reliability score based on uptime (0-100)
  const reliabilityScore = node.uptime;
  
  // Weighted overall score
  const overall = (
    healthScore * 0.3 +
    performanceScore * 0.25 +
    storageScore * 0.2 +
    reliabilityScore * 0.25
  );
  
  return {
    overall: Math.round(overall),
    health: healthScore,
    performance: performanceScore,
    storage: storageScore,
    reliability: reliabilityScore,
  };
}

/**
 * Get health score based on status
 */
function getHealthScore(health: PNode['health']): number {
  switch (health) {
    case 'healthy':
      return 100;
    case 'degraded':
      return 60;
    case 'down':
      return 0;
    default:
      return 0;
  }
}

/**
 * Get performance score based on latency
 */
function getPerformanceScore(latency: number): number {
  // Lower latency = higher score
  // 0ms = 100, 1000ms = 0
  if (latency <= 50) return 100;
  if (latency >= 1000) return 0;
  return Math.max(0, 100 - (latency / 10));
}

/**
 * Get storage score based on available space
 */
function getStorageScore(storage: PNode['storage']): number {
  const usedPercentage = (storage.used / storage.total) * 100;
  // More available space = higher score
  return Math.max(0, 100 - usedPercentage);
}



