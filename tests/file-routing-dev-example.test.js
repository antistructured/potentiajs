import { rm } from 'node:fs/promises';

import { describe, expect, test } from 'bun:test';

import { generateFileRoutes } from '../src/dev/file-routing/index.js';

const routesRoot = new URL('../examples/file-routing-dev/routes/', import.meta.url).pathname;
const generatedDir = new URL('../examples/file-routing-dev/.potentia/', import.meta.url);
const outputFile = new URL('../examples/file-routing-dev/.potentia/routes.generated.js', import.meta.url).pathname;
const exampleIndex = new URL('../examples/file-routing-dev/index.js', import.meta.url).href;

describe('file routing dev workflow example', () => {
  test('generates routes and consumes them explicitly through the example app', async () => {
    await cleanup();

    try {
      const result = await generateFileRoutes({ rootDir: routesRoot, outputFile });

      expect(result.ok).toBe(true);
      expect(result.source).toContain("import { createRoutes, mount } from 'potentiajs';");
      expect(result.source).toContain("import scope0 from '../routes/users/_routes.js';");

      const { app } = await import(`${exampleIndex}?t=${Date.now()}`);

      const root = await app.fetch(new Request('http://local.test/'));
      expect(await root.json()).toEqual({ route: 'example-root' });

      const users = await app.fetch(new Request('http://local.test/users', { headers: { 'x-dev-scope': 'example' } }));
      expect(await users.json()).toEqual({ users: [] });

      const user = await app.fetch(new Request('http://local.test/users/123', { headers: { 'x-dev-scope': 'example' } }));
      expect(await user.json()).toEqual({ id: '123', scope: 'example' });

      const missingHeader = await app.fetch(new Request('http://local.test/users/123'));
      expect(missingHeader.status).toBe(400);
    } finally {
      await cleanup();
    }
  });
});

async function cleanup() {
  await rm(generatedDir, { recursive: true, force: true });
}
