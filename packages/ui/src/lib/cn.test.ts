import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('junta classes e ignora falso', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c');
  });
});
