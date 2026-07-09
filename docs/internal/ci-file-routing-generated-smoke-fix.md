# CI File Routing Generated Smoke Fix

## Files inspected

- `tests/file-routing-generated-smoke.test.js`
- `src/dev/file-routing/generator.js`
- `src/dev/file-routing/writer.js`
- `examples/**/.potentia/` generated-output search

## Files changed

- `tests/file-routing-generated-smoke.test.js`
- `docs/internal/ci-file-routing-generated-smoke-fix.md`

## Current generated output expectations

The generated smoke now verifies:

- generated source starts with the PotentiaJS generated-file header
- generated source imports from `@potentiajs/core`
- generated source does not import `node:fs`
- generated routes can be imported and consumed through `createApp(...)`
- generated output excludes private route files
- generated output is cleaned in `finally`

Expected generated import:

```js
import { createRoutes, mount } from '@potentiajs/core';
```

## Package identity

The generator default package name remains:

```txt
@potentiajs/core
```

`packageName` override behavior is unchanged.

## Generated output cleanup

Searched `examples/` for committed/generated route output:

```txt
examples/**/.potentia/: none
examples/**/routes.generated.js: none
```

The smoke fixture also cleans:

- fixture `.potentia/`
- fixture `node_modules/`

## Verification

```txt
bun test tests/file-routing-generated-smoke.test.js
1 pass
0 fail
12 expect() calls
```

## Blockers

None.
