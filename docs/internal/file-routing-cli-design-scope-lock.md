# File Routing CLI Design Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `examples/file-routing-basic/`
- `examples/file-routing-basic/README.md`
- `examples/file-routing-basic/generate.js`
- `src/file-routing.js`
- `src/dev/file-routing/`
- `scripts/generate-file-routes.js`
- `docs/internal/file-routing-public-docs-example-report.md`
- `docs/internal/file-routing-public-api-foundation-scope-lock.md`
- `docs/internal/file-routing-public-api-design-gate-report.md`

## Current public file-routing state

Current package identity:

```txt
@potentiajs/core@0.1.0-preview.0
```

Current public file-routing surface:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```

The subpath is implemented by `src/file-routing.js` and exports only `generateFileRoutes`. Root exports remain unchanged.

Current public example:

```txt
examples/file-routing-basic/
```

It ships in the package and uses the public subpath directly through `generate.js`.

Current package metadata has no `bin` field.

## Why design the CLI now

File routing is now usable through a scriptable API, but the user-facing workflow still requires each app/example to write a small local generation script. A CLI can make the common dev/build step easier while keeping the programmatic API first-class.

The CLI should be designed before implementation because it creates durable user-facing commitments:

- binary name
- command shape
- flag names
- exit codes
- output format
- config/watch boundaries
- relationship to generated output

## CLI relationship to `generateFileRoutes(...)`

The CLI should be a thin dev-time wrapper around:

```js
generateFileRoutes({
  rootDir,
  outputFile,
  packageName,
  cwd
});
```

Allowed future flow:

```txt
potentia routes generate
↓
generateFileRoutes(...)
↓
.potentia/routes.generated.js
↓
createApp(...)
```

The CLI should not invent a second generation engine or route model.

## Forbidden in this block

This design gate must not implement:

- package `bin`
- `bin/potentia.js`
- CLI parser
- command runner
- watch mode
- config loading
- compiler integration
- root export changes
- subpath export changes
- generated output behavior changes
- route convention changes
- release/publish workflow fixes
- npm/JSR publish

## Out of scope

- `potentia dev`
- hidden framework runtime
- app boot ownership
- request-time filesystem scanning
- frontend compiler/build system
- project generator/scaffolder
- OpenAPI/client/form generation

## Findings

- The current internal `scripts/generate-file-routes.js` is useful evidence for a future CLI but is not a public command.
- The public example correctly uses `generateFileRoutes(...)`; future CLI docs should keep this programmatic API documented rather than replacing it.
- README currently says there is no public CLI yet; this remains truthful and should not be changed during this design-only block.

## Publish status

No publish command was run.
