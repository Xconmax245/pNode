/**
 * Time utility functions
 * TODO: Add timezone handling and formatting options
 */

/**
 * Format timestamp to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) {
    return `${diffSecs} second${diffSecs !== 1 ? 's' : ''} ago`;
  }
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }
  if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
  
  return time.toLocaleDateString();
}

/**
 * Format timestamp to readable date string
 */
export function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}

/**
 * Get time difference in milliseconds
 */
export function getTimeDifference(timestamp: string): number {
  return new Date().getTime() - new Date(timestamp).getTime();
}



