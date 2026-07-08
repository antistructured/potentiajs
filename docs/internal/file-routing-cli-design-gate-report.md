# File Routing CLI Design Gate Report

## 1. Current file-routing public API

Current public API:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```

Current package state:

- package: `@potentiajs/core`
- version: `0.1.0-preview.0`
- root export: unchanged, no `generateFileRoutes`
- subpath: `@potentiajs/core/file-routing`
- subpath exports: `generateFileRoutes`
- public example: `examples/file-routing-basic/`
- no package `bin`
- no public CLI
- no watch mode
- no compiler integration

## 2. CLI scope

The CLI should be a thin dev-time wrapper around:

```js
generateFileRoutes({ rootDir, outputFile, packageName, cwd });
```

Allowed flow:

```txt
potentia routes generate
↓
generateFileRoutes(...)
↓
.potentia/routes.generated.js
↓
createApp(...)
```

Disallowed:

- hidden runtime route registration
- request-time filesystem scanning
- app boot ownership
- dev server/process manager
- frontend compiler/build system
- project scaffolder

## 3. Binary name decision

Chosen future binary:

```txt
potentia
```

Future package metadata shape, when implemented later:

```json
{
  "bin": {
    "potentia": "./bin/potentia.js"
  }
}
```

Fallback if collision/brand concern appears before implementation:

```txt
potentiajs
```

## 4. First command decision

Chosen first command:

```bash
potentia routes generate
```

Rationale:

- explicit route tooling namespace
- describes generation, not runtime routing
- maps directly to `generateFileRoutes(...)`
- leaves room for `routes check` and `routes watch`
- avoids implying full `dev` or `build` platform

Rejected:

- `potentia generate-routes`
- `potentia file-routes`
- `potentia dev`
- `potentia build`

## 5. Initial option surface

Initial flags for first implementation:

```txt
--root <dir>
--out <file>
--package <specifier>
--cwd <dir>
```

Do not include initially:

```txt
--json
--check
--watch
--config
--manifest
--clean
--verbose
--silent
```

## 6. Defaults

```txt
root: routes
out: .potentia/routes.generated.js
package: @potentiajs/core
cwd: process.cwd()
```

Mapping:

```js
generateFileRoutes({
  rootDir: root,
  outputFile: out,
  packageName: package,
  cwd
});
```

## 7. Diagnostics / output

Success output to stdout:

```txt
Generated file routes:
- root: routes
- output: .potentia/routes.generated.js
- routes: 3
- scopes: 1
```

Errors to stderr:

```txt
File route generation failed:
- POTENTIA_FILE_ROUTE_COLLISION routes/users/[id].js Route collision with routes/users/[userId].js
```

Diagnostic display should include:

- code
- file/path/location when available
- message

Stack traces should be hidden by default.

JSON mode is deferred and should eventually mirror `generateFileRoutes(...)` result shape.

## 8. Exit codes

```txt
0 = generation successful
1 = generation failed due to route diagnostics, scanner/generator failure, or write/IO failure
2 = invalid CLI usage/options
```

Future `--check` behavior when implemented later:

```txt
0 = generated output is current
1 = generated output is stale or generation would fail
2 = invalid CLI usage/options
```

## 9. Config decision

No config file in first CLI implementation.

Deferred:

- `potentia.config.js`
- `package.json` `potentia` field
- `.potentiarc`

Reason: current option surface is tiny; config would create another stable API before usage evidence.

## 10. Watch decision

Defer watch mode.

Future possible command:

```bash
potentia routes watch
```

Reason: watch mode introduces process lifecycle, debounce, repeated diagnostics, signal handling, and failure recovery semantics.

## 11. README / example future docs decision

Before CLI implementation, keep docs focused on:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```

After CLI implementation, docs should be ordered:

1. CLI quickstart
2. Programmatic API fallback
3. Generated output explanation

Keep `examples/file-routing-basic/generate.js` after CLI implementation as a programmatic API example and test helper.

Do not claim CLI exists until implementation lands.

## 12. Deferred features

Deferred:

- CLI implementation
- package `bin`
- `--json`
- `--check`
- `routes watch`
- config files
- manifest output
- clean command
- verbose/silent modes
- route convention expansion
- compiler/dev server/build platform
- release blocker fixes

## 13. First implementation plan

Recommended minimal implementation block:

1. Add `bin/potentia.js`.
2. Add package `bin`:
   ```json
   { "potentia": "./bin/potentia.js" }
   ```
3. Implement only:
   ```bash
   potentia routes generate
   ```
4. Support flags:
   ```txt
   --root <dir>
   --out <file>
   --package <specifier>
   --cwd <dir>
   ```
5. Call public `generateFileRoutes(...)` or the same writer implementation through the public subpath boundary.
6. Add tests for success, diagnostics failure, invalid usage, root export cleanliness, package pack inclusion, and packed artifact command smoke.
7. Update README/example only after the command actually works.

## 14. Risks

- Binary name `potentia` may collide with another installed tool.
- CLI output becomes a compatibility surface.
- Users may expect `potentia dev`; docs must keep this scoped to route generation.
- Watch/config pressure may grow quickly; keep first implementation minimal.
- CLI must not drift from `generateFileRoutes(...)` semantics.

## 15. Recommendation

Recommendation:

```txt
A — Implement Minimal CLI Foundation
```

Reason: design is clear, the public API is already implemented, and a one-shot generation CLI can be a thin wrapper without expanding routing semantics.

## Implementation status

No implementation was added.

No package `bin` was added.

No source API changed.

## Publish status

No publish command was run.
