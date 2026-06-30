#!/usr/bin/env bun

import { generateFileRoutes } from '../src/dev/file-routing/index.js';

const options = parseArgs(process.argv.slice(2));

if (!options.ok) {
  console.error(`file routes generation failed: ${options.error}`);
  process.exit(1);
}

const result = await generateFileRoutes({
  rootDir: options.root,
  outputFile: options.out,
  packageName: options.packageName
});

if (!result.ok) {
  console.error(`file routes generation failed: ${result.errors.length} error(s)`);
  for (const error of result.errors) {
    const location = error.filePath || error.rootDir || error.outputFile || result.rootDir;
    console.error(`- ${error.code}: ${error.message}${location ? ` (${location})` : ''}`);
  }
  process.exit(1);
}

console.log(`file routes generated: ${result.outputFile}`);
console.log(`routes: ${result.routes}, scopes: ${result.scopes}`);

function parseArgs(args) {
  const parsed = {
    ok: true,
    root: 'routes',
    out: '.potentia/routes.generated.js',
    packageName: 'potentia-js'
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--root') {
      parsed.root = args[index + 1];
      index += 1;
      continue;
    }
    if (arg === '--out') {
      parsed.out = args[index + 1];
      index += 1;
      continue;
    }
    if (arg === '--package') {
      parsed.packageName = args[index + 1];
      index += 1;
      continue;
    }
    return { ok: false, error: `Unknown argument ${arg}` };
  }

  if (!parsed.root) return { ok: false, error: '--root requires a value' };
  if (!parsed.out) return { ok: false, error: '--out requires a value' };
  if (!parsed.packageName) return { ok: false, error: '--package requires a value' };

  return parsed;
}
