# CI File Routing Dev Workflow Example Fix

## Files inspected

- `tests/file-routing-dev-example.test.js`
- `examples/file-routing-dev/README.md`
- `examples/file-routing-dev/index.js`
- `examples/file-routing-dev/routes/`
- `scripts/generate-file-routes.js`
- `src/file-routing.js`

## Files changed

- `tests/file-routing-dev-example.test.js`
- `scripts/generate-file-routes.js`
- `examples/file-routing-dev/README.md`
- `docs/internal/ci-file-routing-dev-workflow-example-fix.md`

## Dev workflow posture

`examples/file-routing-dev/` remains repo-only development evidence.

It is not listed in package `files`, so it is not shipped as public npm example content.

## API alignment

The dev workflow now aligns with the current public file-routing subpath:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```

Applied to:

- `tests/file-routing-dev-example.test.js`
- `scripts/generate-file-routes.js`

The generated output still imports runtime route composition from:

```js
import { createRoutes, mount } from '@potentiajs/core';
```

`generateFileRoutes` remains not exported from the package root.

## Generated output handling

The dev workflow test cleans:

```txt
examples/file-routing-dev/.potentia/
```

The manual dev script was executed successfully and generated output was removed afterward.

## Verification

```txt
bun test tests/file-routing-dev-example.test.js
1 pass
0 fail
7 expect() calls
```

Dev script smoke:

```bash
bun run generate:file-routes -- --root examples/file-routing-dev/routes --out examples/file-routing-dev/.potentia/routes.generated.js
```

Result:

```txt
routes: 3, scopes: 1
```

Generated `.potentia/` output was cleaned after the smoke.

## Blockers

None.
