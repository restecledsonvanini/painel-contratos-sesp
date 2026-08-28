import { describe, expect, it, vi } from 'vitest';
import { emitUnauthorized, onUnauthorized } from './authSession';

describe('authSession', () => {
  it('onUnauthorized dispara no emitUnauthorized', () => {
    const fn = vi.fn();
    const off = onUnauthorized(fn);
    emitUnauthorized();
    expect(fn).toHaveBeenCalledTimes(1);
    off();
    emitUnauthorized();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('suporta vários listeners', () => {
    const a = vi.fn();
    const b = vi.fn();
    onUnauthorized(a);
    onUnauthorized(b);
    emitUnauthorized();
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });
});
