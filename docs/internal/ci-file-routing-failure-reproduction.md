# CI File Routing Failure Reproduction

## Tests run

```bash
bun test tests/file-routing-dev-example.test.js
bun test tests/file-routing-generated-smoke.test.js
```

The user-provided historical name `tests/file-routing-dev-workflow-example.test.js` is not present locally. The matching local file is:

```txt
tests/file-routing-dev-example.test.js
```

## Result before alignment patches

Both targeted tests already passed locally:

```txt
file routing dev workflow example: 1 pass, 0 fail, 7 expect() calls
file routing generated smoke: 1 pass, 0 fail, 11 expect() calls
```

## Root-cause finding

The remote failure was not reproducible on the current local branch. The evidence points to the remote run using an older commit/working tree with stale file-routing package identity assumptions.

Current local active generated smoke already expected:

```js
import { createRoutes, mount } from '@potentiajs/core';
```

and generated output imports worked through an `@potentiajs/core` symlink.

## Alignment patches made after reproduction

Although the exact failure was already fixed locally, this pass made two targeted hardening updates:

- `tests/file-routing-dev-example.test.js` now imports `generateFileRoutes` from the public subpath `@potentiajs/core/file-routing`, matching current API expectations.
- `tests/file-routing-generated-smoke.test.js` now asserts the generated PotentiaJS header in addition to current package identity and no runtime `node:fs` import.

## Result after alignment patches

```txt
file routing dev workflow example: 1 pass, 0 fail, 7 expect() calls
file routing generated smoke: 1 pass, 0 fail, 12 expect() calls
```

## Blockers

None.
