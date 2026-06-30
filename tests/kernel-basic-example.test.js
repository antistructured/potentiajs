import { describe, expect, test } from 'bun:test';

import { app } from '../examples/kernel-basic/index.js';

describe('kernel basic example smoke', () => {
  test('serves static route', async () => {
    const response = await app.fetch(new Request('http://local.test/'));

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('potentia kernel basic example');
  });

  test('serves dynamic route params', async () => {
    const response = await app.fetch(new Request('http://local.test/users/123'));

    expect(await response.json()).toEqual({ id: '123' });
  });

  test('validates query and header contracts', async () => {
    const response = await app.fetch(new Request('http://local.test/search?q=potentia&tag=kernel&tag=bun', {
      headers: { 'x-mode': 'example' }
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ term: 'potentia', tags: ['kernel', 'bun'] });
  });

  test('validates body and response contracts', async () => {
    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: ' Ada ' })
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: 1, name: 'Ada' });
  });
});
