/**
 * Algorithmic Risk Engine for Student CRM
 * Calculates risk based on velocity (time since last interaction) and overall completion.
 */

export function calculateRiskLevel(progressScore: number, lastActiveDaysAgo: number): 'low' | 'medium' | 'high' {
  // Critical Risk: Abandoned or severely lagging while inactive
  if (lastActiveDaysAgo > 14 || (lastActiveDaysAgo > 7 && progressScore < 30)) {
    return 'high';
  }
  
  // Warning Risk: Losing momentum or struggling to progress
  if (lastActiveDaysAgo > 7 || progressScore < 50) {
    return 'medium';
  }
  
  // Healthy: Active and progressing well
  return 'low';
}

/**
 * Utility to calculate days between now and a target date
 */
export function getDaysSince(date: Date | string): number {
  const targetTime = new Date(date).getTime();
  const now = new Date().getTime();
  
  const diffTime = Math.abs(now - targetTime);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
