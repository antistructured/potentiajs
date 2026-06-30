import { readFile, rm, writeFile } from 'node:fs/promises';

import { describe, expect, test } from 'bun:test';

import { generateFileRoutes } from '../src/dev/file-routing/index.js';

const rootDir = new URL('./fixtures/file-routing-regeneration/routes/', import.meta.url).pathname;
const missingRoot = new URL('./fixtures/file-routing-regeneration/missing-routes/', import.meta.url).pathname;
const generatedDir = new URL('./fixtures/file-routing-regeneration/.potentia/', import.meta.url);
const outputFile = new URL('./fixtures/file-routing-regeneration/.potentia/routes.generated.js', import.meta.url).pathname;

describe('file routing regeneration', () => {
  test('running writer twice produces identical output', async () => {
    await cleanup();

    try {
      const first = await generateFileRoutes({ rootDir, outputFile });
      const firstFile = await readFile(outputFile, 'utf8');
      const second = await generateFileRoutes({ rootDir, outputFile });
      const secondFile = await readFile(outputFile, 'utf8');

      expect(first.ok).toBe(true);
      expect(second.ok).toBe(true);
      expect(second.source).toBe(first.source);
      expect(secondFile).toBe(firstFile);
      expect(secondFile).toBe(second.source);
    } finally {
      await cleanup();
    }
  });

  test('existing generated file is overwritten on success', async () => {
    await cleanup();

    try {
      await writeSeed('stale generated output');
      const result = await generateFileRoutes({ rootDir, outputFile });

      expect(result.ok).toBe(true);
      expect(await readFile(outputFile, 'utf8')).toBe(result.source);
      expect(result.source).not.toContain('stale generated output');
    } finally {
      await cleanup();
    }
  });

  test('failed regeneration preserves prior valid output and never writes partial output', async () => {
    await cleanup();

    try {
      const valid = await generateFileRoutes({ rootDir, outputFile });
      const validSource = await readFile(outputFile, 'utf8');
      const failed = await generateFileRoutes({ rootDir: missingRoot, outputFile });

      expect(valid.ok).toBe(true);
      expect(failed.ok).toBe(false);
      expect(failed.written).toBe(false);
      expect(await readFile(outputFile, 'utf8')).toBe(validSource);
      expect(await readFile(outputFile, 'utf8')).not.toContain('.tmp-');
    } finally {
      await cleanup();
    }
  });

  test('generated source is deterministic across route discovery order', async () => {
    await cleanup();

    try {
      const result = await generateFileRoutes({ rootDir, outputFile });
      const source = result.source;
      const rootIndex = source.indexOf("import route0 from '../routes/index.js';");
      const alphaIndex = source.indexOf("import route1 from '../routes/alpha.js';");
      const nestedIndex = source.indexOf("import route2 from '../routes/nested/index.js';");
      const betaIndex = source.indexOf("import route3 from '../routes/nested/beta.js';");
      const zetaIndex = source.indexOf("import route4 from '../routes/zeta.js';");

      expect(result.ok).toBe(true);
      expect(rootIndex).toBeGreaterThan(-1);
      expect(alphaIndex).toBeGreaterThan(rootIndex);
      expect(nestedIndex).toBeGreaterThan(alphaIndex);
      expect(betaIndex).toBeGreaterThan(nestedIndex);
      expect(zetaIndex).toBeGreaterThan(betaIndex);
    } finally {
      await cleanup();
    }
  });

  test('output directory creation is deterministic and temp output is cleaned', async () => {
    await cleanup();

    try {
      const result = await generateFileRoutes({ rootDir, outputFile });
      const source = await readFile(outputFile, 'utf8');

      expect(result.ok).toBe(true);
      expect(source).toBe(result.source);
      const entriesCheck = Bun.spawnSync({
        cmd: ['bash', '-lc', `find ${JSON.stringify(new URL('./fixtures/file-routing-regeneration/.potentia/', import.meta.url).pathname)} -name '*.tmp-*' | wc -l`]
      });
      expect(new TextDecoder().decode(entriesCheck.stdout).trim()).toBe('0');
    } finally {
      await cleanup();
    }
  });
});

async function writeSeed(content) {
  await generateFileRoutes({ rootDir, outputFile });
  await writeFile(outputFile, content);
}

async function cleanup() {
  await rm(generatedDir, { recursive: true, force: true });
}
