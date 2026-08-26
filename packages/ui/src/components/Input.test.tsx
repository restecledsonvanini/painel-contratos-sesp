import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('associa label ao campo', () => {
    const html = renderToStaticMarkup(<Input label="E-mail" name="email" />);
    expect(html).toContain('E-mail');
    expect(html).toContain('id="input-e-mail"');
  });
});
