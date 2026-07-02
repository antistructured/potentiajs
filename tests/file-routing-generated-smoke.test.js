import { mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { describe, expect, test } from 'bun:test';

import { createApp } from '../src/index.js';
import { generateRouteModule, scanRouteTree } from '../src/dev/file-routing/index.js';

const fixtureRoot = new URL('./fixtures/file-routing-app/', import.meta.url).pathname;
const routesRoot = new URL('./fixtures/file-routing-app/routes/', import.meta.url).pathname;
const outputPath = new URL('./fixtures/file-routing-app/.potentia/routes.generated.js', import.meta.url).pathname;

describe('file routing generated smoke', () => {
  test('scan → generate → import → createApp serves projected routes', async () => {
    const generatedDir = new URL('./fixtures/file-routing-app/.potentia/', import.meta.url);
    const nodeModulesDir = new URL('./fixtures/file-routing-app/node_modules/', import.meta.url);
    await rm(generatedDir, { recursive: true, force: true });
    await rm(nodeModulesDir, { recursive: true, force: true });

    try {
      const scan = scanRouteTree(routesRoot);
      const generated = generateRouteModule(scan, { outputPath });

      expect(generated.ok).toBe(true);
      expect(generated.source).toContain("import { createRoutes, mount } from 'potentiajs';");
      expect(generated.source).not.toContain('node:fs');

      await mkdir(dirname(outputPath), { recursive: true });
      await mkdir(resolve(fixtureRoot, 'node_modules'), { recursive: true });
      await symlink(resolve(fixtureRoot, '../../../'), resolve(fixtureRoot, 'node_modules/potentiajs'), 'dir');
      await writeFile(outputPath, generated.source);

      const generatedRoutes = (await import(`${new URL(outputPath, 'file://').href}?t=${Date.now()}`)).default;
      const app = createApp({ routes: [generatedRoutes] });

      const root = await app.fetch(new Request('http://local.test/'));
      expect(await root.json()).toEqual({ route: 'root' });

      const health = await app.fetch(new Request('http://local.test/health'));
      expect(await health.json()).toEqual({ ok: true });

      const users = await app.fetch(new Request('http://local.test/users', { headers: { 'x-scope': 'yes' } }));
      expect(await users.json()).toEqual({ users: [] });

      const user = await app.fetch(new Request('http://local.test/users/42', { headers: { 'x-scope': 'yes' } }));
      expect(await user.json()).toEqual({ id: '42', scoped: 'yes' });

      expect(generated.source).not.toContain('_private.js');
      const privateFile = await app.fetch(new Request('http://local.test/_private', { headers: { 'x-scope': 'yes' } }));
      expect(privateFile.status).toBe(404);

      const contractFailure = await app.fetch(new Request('http://local.test/users/42'));
      expect(contractFailure.status).toBe(400);
      expect((await contractFailure.json()).error).toMatchObject({
        code: 'POTENTIA_CONTRACT_FAILED',
        boundary: 'headers'
      });
    } finally {
      await rm(generatedDir, { recursive: true, force: true });
      await rm(nodeModulesDir, { recursive: true, force: true });
    }
  });
});
