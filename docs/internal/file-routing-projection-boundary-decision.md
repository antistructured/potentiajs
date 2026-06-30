# File Routing Projection / Build Boundary Decision

## Files inspected

- `package.json`
- `src/index.js`
- `src/kernel/route-collection.js`
- `src/kernel/app.js`
- `docs/internal/file-routing-scope-lock.md`
- `docs/internal/file-routing-path-mapping-decision.md`
- `docs/internal/file-routing-route-module-export-decision.md`
- `docs/internal/file-routing-folder-metadata-decision.md`

## Status

This is a design decision only. No generator, CLI, compiler, or runtime filesystem scanner was implemented.

## Core decision

Reject production runtime filesystem scanning.

File routing must project into an explicit generated/importable route module. The kernel must remain independent of filesystem APIs.

Accepted hierarchy:

```txt
routes/ filesystem
↓ dev/build projector
.potentia/routes.generated.js
↓ explicit createRoutes(...) tree
createApp({ routes: [generatedRoutes] })
```

## Chosen projection model

Initial implementation should be a dev/build utility that:

1. scans a `routes/` directory
2. applies path mapping rules
3. imports or references route modules
4. validates default export shapes
5. detects collisions
6. emits a generated ESM route module
7. leaves the kernel runtime unchanged

## Generated file location

Accepted initial location:

```txt
.potentia/routes.generated.js
```

Reasons:

- makes generated ownership obvious
- avoids polluting source directories
- works with explicit import from app entrypoint
- leaves room for future generated manifests

## Commit policy

Generated files should not be committed by default.

Future projects may choose to commit generated output for deployment reproducibility, but Potentia should not require it.

Recommended ignore entry later:

```txt
.potentia/
```

Do not add ignore files in this design gate.

## Future generated output shape

Conceptual shape:

```js
import { createRoutes, mount } from 'potentia-js';

import root from '../routes/index.js';
import usersIndex from '../routes/users/index.js';
import userById from '../routes/users/[id].js';
import usersScope from '../routes/users/_routes.js';

export default createRoutes({
  routes: [
    root,
    mount(createRoutes({
      prefix: '/users',
      hooks: usersScope.hooks,
      contracts: usersScope.contracts,
      meta: usersScope.meta,
      routes: [
        usersIndex,
        userById
      ]
    }))
  ]
});
```

The exact emitted code may be simpler, but it must use explicit Potentia primitives.

## CLI/compiler ownership

Future CLI/dev tool owns generation.

The kernel should not export filesystem helpers in the first implementation.

Deferred:

- `fromFiles()` public helper
- runtime scanner
- watch mode
- compiler integration
- route manifest public API

## Bun filesystem isolation

Any filesystem usage should live outside `src/kernel/`.

Potential future locations:

- `src/dev/` for dev-only utilities
- `src/cli/` if a CLI exists later
- separate package only if a future package split is explicitly approved

Do not import `fs`, `node:fs`, or Bun filesystem APIs in the kernel.

## Error reporting

Projection errors should fail closed and report:

- source file path
- mapped route path
- HTTP method when known
- collision participants
- unsupported export shape
- unsupported filename convention

Projection errors must not expose request bodies, runtime request values, stack traces by default, or unsafe thrown validator internals.

## Collision policy

Fail projection before app startup when:

- duplicate method/path pairs are produced
- unsupported filename patterns are encountered
- `_routes.js` has invalid export shape
- route module export shape is unsupported
- explicit route path conflicts with mapped filesystem path
- generated order would be ambiguous

## Direct `fromFiles()` helper

Deferred.

Reason:

- a helper exported from the kernel risks introducing runtime filesystem magic
- API naming and stability are premature
- dev/build generation keeps the explicit model clearer

## Hybrid dev/build approach

Accepted later:

- dev mode may regenerate on file changes
- build mode may emit a static file once
- both modes output explicit ESM, not hidden runtime discovery

## Blockers

- no CLI/dev tool exists
- no generated manifest format exists
- no collision diagnostics implementation exists
- no route source metadata primitive exists
- no implementation was added
