import { describe, it, expect } from 'vitest';
import { cn } from '../lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges tailwind classes using clsx', () => {
      expect(cn('w-4 h-4', 'text-white')).toBe('w-4 h-4 text-white');
    });

    it('handles conditional classes properly', () => {
      expect(cn('w-4 h-4', true && 'text-white', false && 'text-black')).toBe('w-4 h-4 text-white');
    });

    it('filters out undefined and null values', () => {
      expect(cn('w-4', undefined, null, 'h-4')).toBe('w-4 h-4');
    });

    it('merges arrays of classes', () => {
      expect(cn(['flex', 'flex-col'], 'gap-2')).toBe('flex flex-col gap-2');
    });
  });
});
