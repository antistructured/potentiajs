import { describe, expect, test } from 'bun:test';

import { app } from '../examples/sigiljs-basic/index.js';

describe('SigilJS basic example smoke', () => {
  test('validates dynamic params/query/response contracts', async () => {
    const response = await app.fetch(new Request('http://local.test/users/1?include=nickname'));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: '1', name: 'Ada Lovelace' });
  });

  test('validates body/response contracts', async () => {
    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Ada' })
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: 'created', name: 'Ada' });
  });

  test('returns deterministic SigilJS contract failure', async () => {
    const response = await app.fetch(new Request('http://local.test/contract-error/not-a-number'));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      error: {
        code: 'POTENTIA_CONTRACT_FAILED',
        message: 'Params failed contract validation',
        boundary: 'params',
        issues: [{ message: 'SigilJS contract rejected value' }]
      }
    });
  });
});
