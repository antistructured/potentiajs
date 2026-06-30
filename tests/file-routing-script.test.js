import { readFile, rm } from 'node:fs/promises';

import { describe, expect, test } from 'bun:test';

const outputDir = new URL('./fixtures/file-routing-script/.potentia/', import.meta.url);
const outputFile = new URL('./fixtures/file-routing-script/.potentia/routes.generated.js', import.meta.url).pathname;
const rootGenerated = new URL('../.potentia/', import.meta.url);

describe('file routing internal script wrapper', () => {
  test('generates routes with explicit args', async () => {
    await cleanup();

    try {
      const result = Bun.spawnSync({
        cmd: [
          'bun',
          'scripts/generate-file-routes.js',
          '--root',
          'tests/fixtures/file-routing-basic/routes',
          '--out',
          outputFile
        ],
        cwd: new URL('../', import.meta.url).pathname,
        stdout: 'pipe',
        stderr: 'pipe'
      });

      expect(result.exitCode).toBe(0);
      expect(new TextDecoder().decode(result.stdout)).toContain('file routes generated:');
      const generated = await readFile(outputFile, 'utf8');
      expect(generated).toContain("import { createRoutes, mount } from 'potentia-js';");
      expect(generated).not.toContain('node:fs');
    } finally {
      await cleanup();
    }
  });

  test('returns nonzero for missing root', async () => {
    await cleanup();

    try {
      const result = Bun.spawnSync({
        cmd: [
          'bun',
          'scripts/generate-file-routes.js',
          '--root',
          'tests/fixtures/file-routing-script/missing-routes',
          '--out',
          outputFile
        ],
        cwd: new URL('../', import.meta.url).pathname,
        stdout: 'pipe',
        stderr: 'pipe'
      });

      expect(result.exitCode).not.toBe(0);
      expect(new TextDecoder().decode(result.stderr)).toContain('POTENTIA_FILE_ROUTE_MISSING_ROOT');
      await expect(readFile(outputFile, 'utf8')).rejects.toThrow();
    } finally {
      await cleanup();
    }
  });

  test('does not leave root project artifact', async () => {
    await cleanup();
    await rm(rootGenerated, { recursive: true, force: true });

    try {
      const result = Bun.spawnSync({
        cmd: [
          'bun',
          'scripts/generate-file-routes.js',
          '--root',
          'tests/fixtures/file-routing-basic/routes',
          '--out',
          outputFile
        ],
        cwd: new URL('../', import.meta.url).pathname,
        stdout: 'pipe',
        stderr: 'pipe'
      });

      expect(result.exitCode).toBe(0);
      await expect(readFile(rootGenerated, 'utf8')).rejects.toThrow();
    } finally {
      await cleanup();
      await rm(rootGenerated, { recursive: true, force: true });
    }
  });
});

async function cleanup() {
  await rm(outputDir, { recursive: true, force: true });
}
