import { build } from 'esbuild';

import { compileDSL } from '../plugins/dsl-ui.mjs';
import { startDevServer } from './dev.mjs';

const args = process.argv.slice(2);
const command = args[0];

if (command === 'dev') startDevServer();
if (command === 'build') {
  build({
    entryPoints: ['./src/index.js'],
    outfile: './dist/app.js',
    bundle: true,
    platform: 'node',
    format: 'esm',
    plugins: [compileDSL()],
    sourcemap: true,
  })
  .catch((err) => {
    console.error('Build failed:', err);
    process.exit(1);
  });
}