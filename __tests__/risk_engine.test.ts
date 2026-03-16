import { describe, it, expect } from 'vitest';
import { calculateRiskLevel } from '@/lib/risk_engine';

describe('Risk Engine Calculator', () => {
  it('should return "high" risk for students inactive for more than 14 days', () => {
    expect(calculateRiskLevel(100, 15)).toBe('high');
    expect(calculateRiskLevel(0, 15)).toBe('high');
  });

  it('should return "high" risk for students inactive for >7 days with <30% progress', () => {
    expect(calculateRiskLevel(29, 8)).toBe('high');
    expect(calculateRiskLevel(10, 13)).toBe('high');
  });

  it('should return "medium" risk for students inactive >7 days but with healthy progress', () => {
    expect(calculateRiskLevel(80, 8)).toBe('medium');
    expect(calculateRiskLevel(50, 14)).toBe('medium');
  });

  it('should return "medium" risk for active students with poor progress (<50%)', () => {
    expect(calculateRiskLevel(49, 1)).toBe('medium');
    expect(calculateRiskLevel(20, 5)).toBe('medium');
  });

  it('should return "low" risk for active tracking students (>50% progress, <7 days inactive)', () => {
    expect(calculateRiskLevel(80, 2)).toBe('low');
    expect(calculateRiskLevel(50, 7)).toBe('low');
    expect(calculateRiskLevel(100, 0)).toBe('low');
  });
});
