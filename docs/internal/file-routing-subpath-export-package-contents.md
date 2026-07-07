# File Routing Subpath Export / Package Contents

## Files inspected

- `package.json`
- `src/index.js`
- `src/dev/file-routing/index.js`
- `src/dev/file-routing/writer.js`
- file-routing design gate docs

## Files changed

- `package.json`
- `src/file-routing.js`
- `src/file-routing.d.ts`
- `docs/internal/file-routing-subpath-export-package-contents.md`

## Subpath added

Added package subpath:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```

Package export:

```json
"./file-routing": {
  "types": "./src/file-routing.d.ts",
  "import": "./src/file-routing.js"
}
```

## Public entry file

Created `src/file-routing.js` with only:

```js
export { generateFileRoutes } from './dev/file-routing/writer.js';
```

This intentionally exposes only `generateFileRoutes(...)` and does not expose scanner, mapper, generator, diagnostic constants, or route collision internals.

## Types

Created conservative preview declarations:

```txt
src/file-routing.d.ts
```

The declaration covers:

- `FileRouteDiagnostic`
- `GenerateFileRoutesOptions`
- `GenerateFileRoutesResult`
- `generateFileRoutes(options)`

## Root export status

Root export file `src/index.js` was not changed.

`generateFileRoutes` is not exported from `@potentiajs/core` root.

## Package contents

Package allowlist now includes:

- `src/file-routing.js`
- `src/file-routing.d.ts`
- `src/dev/file-routing/`

Still intentionally excluded:

- `docs/internal/`
- tests
- `.github/`
- `.potentia/`
- `examples/file-routing-dev/`

## CLI/bin status

No `bin` field was added.

No CLI command was added.

## Blockers

None for this pass.

## Publish status

No publish command was run.
