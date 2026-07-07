# File Routing Public Subpath Tests

## Files inspected

- `package.json`
- `src/file-routing.js`
- `src/index.js`
- existing file-routing tests

## Files changed

- `tests/file-routing-subpath-export.test.js`
- `docs/internal/file-routing-public-subpath-tests.md`

## Tests added

Created:

```txt
tests/file-routing-subpath-export.test.js
```

Coverage:

- package self-import from `@potentiajs/core/file-routing`
- subpath exposes only `generateFileRoutes`
- root package does not expose `generateFileRoutes`
- subpath generation works with default package import
- generated output imports from `@potentiajs/core`
- generated output includes warning header
- generated output contains no runtime filesystem scanning import

## Root export status

Root package import remains clean:

```js
import * as rootApi from '@potentiajs/core';
```

Assertion:

```js
'generateFileRoutes' in rootApi === false
```

## CLI/bin status

No CLI/bin behavior is imported or tested because no CLI/bin was added.

## Blockers

None for this pass.

## Publish status

No publish command was run.
