import { describe, expect, test } from 'bun:test';

import { app } from '../examples/composed-basic/index.js';

describe('composed basic example smoke', () => {
  test('serves app root route', async () => {
    const response = await app.fetch(new Request('http://local.test/'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  test('serves mounted user route with scoped and route contracts', async () => {
    const response = await app.fetch(new Request('http://local.test/api/users/1?include=full', {
      headers: { 'x-auth': 'yes' }
    }));

    expect(response.status).toBe(200);
    expect(response.headers.get('x-composed-example')).toBe('yes');
    expect(await response.json()).toEqual({ id: '1', name: 'Ada Lovelace' });
  });

  test('validates scoped header contract', async () => {
    const response = await app.fetch(new Request('http://local.test/api/users/1'));

    expect(response.status).toBe(400);
    expect((await response.json()).error.boundary).toBe('headers');
  });

  test('validates body and response contracts', async () => {
    const response = await app.fetch(new Request('http://local.test/api/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-auth': 'yes' },
      body: JSON.stringify({ name: 'Ada' })
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: 'created', name: 'Ada' });
  });

  test('serves plugin route', async () => {
    const response = await app.fetch(new Request('http://local.test/health'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });
});
