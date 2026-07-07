import { describe, expect, test } from 'bun:test';

import { generateRouteModule, scanRouteTree } from '../src/dev/file-routing/index.js';

const rootDir = new URL('./fixtures/file-routing-basic/routes/', import.meta.url).pathname;
const outputPath = new URL('./fixtures/file-routing-basic/.potentia/routes.generated.js', import.meta.url).pathname;

describe('file routing generator', () => {
  test('generator emits deterministic explicit route composition source', () => {
    const scan = scanRouteTree(rootDir);
    const generated = generateRouteModule(scan, { outputPath });

    expect(generated.ok).toBe(true);
    expect(generated.errors).toEqual([]);
    expect(generated.outputPath).toBe(outputPath);
    expect(generated.source).toContain("import { createRoutes, mount } from '@potentiajs/core';");
    expect(generated.source).toContain("import route0 from '../routes/index.js';");
    expect(generated.source).toContain("import route1 from '../routes/health.js';");
    expect(generated.source).toContain("import route2 from '../routes/users/index.js';");
    expect(generated.source).toContain("import route3 from '../routes/users/[id].js';");
    expect(generated.source).toContain("import scope0 from '../routes/users/_routes.js';");
    expect(generated.source).toContain('export default createRoutes({');
    expect(generated.source).toContain("mount(createRoutes({");
    expect(generated.source).toContain("prefix: '/users'");
    expect(generated.source).toContain('hooks: scope0.hooks');
    expect(generated.source).toContain('contracts: scope0.contracts');
    expect(generated.source).not.toContain('readdir');
    expect(generated.source).not.toContain('node:fs');
  });

  test('generator import list is stable', () => {
    const generated = generateRouteModule(scanRouteTree(rootDir), { outputPath });

    expect(generated.imports.map((entry) => entry.importName)).toEqual(['route0', 'route1', 'route2', 'route3', 'scope0']);
  });

  test('generator fails when scanner result has errors', () => {
    const badRoot = new URL('./fixtures/file-routing-collisions/routes/', import.meta.url).pathname;
    const generated = generateRouteModule(scanRouteTree(badRoot), { outputPath });

    expect(generated).toMatchObject({
      ok: false,
      source: '',
      outputPath: outputPath,
      imports: []
    });
    expect(generated.errors.length).toBeGreaterThan(0);
  });
});
