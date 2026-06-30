import { spawn } from 'child_process';
import { watch } from 'fs';

let proc;
function restartServer() {
  if (proc) proc.kill();
  proc = spawn('bun', ['run', './src/index.mjs'], { stdio: 'inhereit' });
}

function buildWithDSL() {
  return build({
    entryPoints: ['./src/index.mjs'],
    bundle: true,
    outfile: './dist/index.mjs',
    format: 'esm',
    platform: 'node',
    sourcemap: true,
  }).catch(() => process.exit(1));
}

export function startDevServer() {
  console.log('🟢 potentia dev server started...');
  restartServer();

  watch('./src', { recursive: true }, (eventType, filename) => {
    if (eventType === 'change' && filename.endsWith('.mjs') || filename.endsWith('.view')) {
      console.log(`🔄 ${filename} changed, restarting server...`);
      restartServer();
    }
  });

  process.on('SIGINT', () => {
    console.log('🔴 Stopping dev server...');
    if (proc) proc.kill();
    process.exit(0);
  });
}
