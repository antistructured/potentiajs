import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { describe, expect, test } from 'bun:test';

import { generateFileRoutes } from '../src/dev/file-routing/index.js';

const routesRoot = new URL('./fixtures/file-routing-basic/routes/', import.meta.url).pathname;
const normalizedRoutesRoot = routesRoot.replace(/\/$/, '');
const outputFile = new URL('./fixtures/file-routing-writer/.potentia/routes.generated.js', import.meta.url).pathname;
const missingRoot = new URL('./fixtures/file-routing-writer/missing-routes/', import.meta.url).pathname;
const fixtureRootGenerated = new URL('./fixtures/file-routing-writer/.potentia/', import.meta.url);
const rootGenerated = new URL('../.potentia/', import.meta.url);

describe('file routing writer', () => {
  test('writes generated file and creates output directory', async () => {
    await cleanup();

    try {
      const result = await generateFileRoutes({ rootDir: routesRoot, outputFile });

      expect(result).toMatchObject({
        ok: true,
        rootDir: normalizedRoutesRoot,
        outputFile: outputFile,
        written: true,
        routes: 4,
        scopes: 1,
        errors: []
      });
      expect(result.source).toContain("import { createRoutes, mount } from '@potentiajs/core';");
      expect(result.source).not.toContain('node:fs');

      const written = await readFile(outputFile, 'utf8');
      expect(written).toBe(result.source);
      expect(written).toContain('export default createRoutes({');
      expect(written).toContain("import route0 from '../../file-routing-basic/routes/index.js';");
    } finally {
      await cleanup();
    }
  });

  test('does not write on scan failure', async () => {
    await cleanup();
    await mkdir(dirname(outputFile), { recursive: true });
    await writeFile(outputFile, 'previous valid output');

    try {
      const result = await generateFileRoutes({ rootDir: missingRoot, outputFile });

      expect(result.ok).toBe(false);
      expect(result.written).toBe(false);
      expect(result.source).toBe('');
      expect(result.routes).toBe(0);
      expect(result.scopes).toBe(0);
      expect(result.errors).toEqual([expect.objectContaining({ code: 'POTENTIA_FILE_ROUTE_MISSING_ROOT' })]);
      expect(await readFile(outputFile, 'utf8')).toBe('previous valid output');
    } finally {
      await cleanup();
    }
  });

  test('does not import or execute route modules while writing', async () => {
    await cleanup();

    try {
      const result = await generateFileRoutes({ rootDir: routesRoot, outputFile });

      expect(result.ok).toBe(true);
      expect(await readFile(outputFile, 'utf8')).toContain("import route0 from '../../file-routing-basic/routes/index.js';");
    } finally {
      await cleanup();
    }
  });

  test('custom package name is respected', async () => {
    await cleanup();

    try {
      const result = await generateFileRoutes({
        rootDir: routesRoot,
        outputFile,
        packageName: '@internal/potentia'
      });

      expect(result.ok).toBe(true);
      expect(result.source).toContain("import { createRoutes, mount } from '@internal/potentia';");
      expect(await readFile(outputFile, 'utf8')).toBe(result.source);
    } finally {
      await cleanup();
    }
  });

  test('does not leave root .potentia artifact', async () => {
    await cleanup();
    await rm(rootGenerated, { recursive: true, force: true });

    try {
      const result = await generateFileRoutes({ rootDir: routesRoot, outputFile });

      expect(result.ok).toBe(true);
      expect(await exists(rootGenerated)).toBe(false);
    } finally {
      await cleanup();
      await rm(rootGenerated, { recursive: true, force: true });
    }
  });
});

async function cleanup() {
  await rm(fixtureRootGenerated, { recursive: true, force: true });
}

async function exists(pathOrUrl) {
  try {
    await readFile(pathOrUrl);
    return true;
  } catch {
    return false;
  }
}
