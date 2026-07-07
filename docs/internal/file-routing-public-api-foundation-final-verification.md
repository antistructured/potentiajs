# File Routing Public API Foundation Final Verification

## Commands run

```bash
bun run test
bun run check:release
npm pack --dry-run --json
npm pack --pack-destination <tmp> --json
```

A packed artifact smoke was also run in a fresh temporary project.

No publish commands were run.

## Results

### Tests

```txt
564 pass
0 fail
1204 expect() calls
```

### Release check

```txt
564 pass
0 fail
1204 expect() calls
```

### Pack dry-run

`npm pack --dry-run --json` passed.

Package summary:

- name: `@potentiajs/core`
- version: `0.1.0-preview.0`
- entry count: `48`
- includes `src/file-routing.js`: yes
- includes `src/file-routing.d.ts`: yes
- includes `src/dev/file-routing/`: yes
- includes `docs/internal/`: no
- includes tests: no
- includes `.potentia/`: no

### Packed artifact smoke

Fresh temp project installed the local tarball and imported:

```js
import { createApp } from '@potentiajs/core';
import * as fileRouting from '@potentiajs/core/file-routing';
```

Observed output:

```json
{"rootHasGenerateFileRoutes":false,"subpathExports":["generateFileRoutes"],"rootStatus":200,"rootBody":"home","userStatus":200,"userBody":{"id":"ada"},"routes":3,"scopes":0,"diagnostics":0,"generatedHasPackageImport":true,"generatedHasHeader":true,"generatedHasRuntimeFs":false}
```

## Invariants verified

- package name unchanged: `@potentiajs/core`
- version unchanged: `0.1.0-preview.0`
- runtime dependencies unchanged: only `@weipertda/sigiljs`
- no dev dependencies added
- root exports unchanged
- subpath export added: `./file-routing`
- no CLI/bin added
- no watch/compiler added
- no frontend/form renderer/client SDK/OpenAPI added
- no publish workflow changes
- generated default import is `@potentiajs/core`
- generated output has warning header
- generated output contains no runtime filesystem scanning import
- package contents exclude internal docs/tests/generated files

## Public API state

Root package:

```js
import { createApp, route } from '@potentiajs/core';
```

File routing subpath:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```

Subpath exports:

```txt
generateFileRoutes
```

## Remaining blockers

None for this file-routing foundation block.

Parked non-blockers from prior release verification remain:

- npm registry visibility
- JSR version visibility
- remote publish/CI workflow failures

Those belong to a separate Release Blocker Fix Pass.

## Recommendation

File Routing Public API Foundation passed.

Recommended next block if continuing file routing:

```txt
File Routing Public Docs / Example App Pass
```

Alternative if release health is urgent:

```txt
Release Blocker Fix Pass
```

## Publish status

Real publish was not run.
