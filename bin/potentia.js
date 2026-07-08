#!/usr/bin/env node

import { main } from '../src/cli.js';

main(process.argv.slice(2), {
  cwd: process.cwd(),
  stdout: process.stdout,
  stderr: process.stderr
}).then((code) => {
  process.exitCode = code;
}).catch((error) => {
  process.stderr.write(`Unexpected Potentia CLI failure: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
