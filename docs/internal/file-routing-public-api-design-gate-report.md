# File Routing Public API Design Gate Report

## 1. Current package

```txt
@potentiajs/core
```

## 2. Current version

```txt
0.1.0-preview.0
```

No version bump was made in this design gate.

## 3. Scope completed

Completed:

- public file-routing scope lock
- public API shape decision
- route convention decision
- generated output/package identity decision
- diagnostics/collision policy decision
- manifest/source metadata decision
- README honesty update
- final verification

Not performed:

- no source implementation
- no root export addition
- no package subpath export addition
- no CLI/bin addition
- no watch mode
- no compiler integration
- no frontend/runtime/form renderer/client SDK/OpenAPI work
- no publish workflow changes
- no npm/JSR publish

## 4. Public API shape

Future public API should be a package subpath, not a root export:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```

Initial public function:

```js
await generateFileRoutes({
  rootDir: 'routes',
  outputFile: '.potentia/routes.generated.js',
  packageName: '@potentiajs/core'
});
```

Root export decision:

```txt
No root export.
```

Rationale:

- file routing is optional dev/build projection tooling
- root exports should remain focused on explicit runtime primitives
- the kernel must stay filesystem-independent
- users who prefer explicit routes should not carry file-routing assumptions

Subpath decision:

```txt
@potentiajs/core/file-routing
```

Chosen over `@potentiajs/core/dev` because it is narrower, clearer, and avoids prematurely creating a broad dev-tools namespace.

## 5. CLI decision

Public CLI is deferred.

Future possible CLI shape:

```bash
bunx @potentiajs/core routes generate --root routes --out .potentia/routes.generated.js
```

No `bin` field or public CLI command should be added until a separate CLI design/implementation block.

## 6. Route conventions

Initial supported conventions:

| File | Route path |
| --- | --- |
| `routes/index.js` | `/` |
| `routes/users/index.js` | `/users` |
| `routes/users/[id].js` | `/users/:id` |
| `routes/users/profile.js` | `/users/profile` |
| nested folders | nested path segments |

Other initial conventions:

- `_`-prefixed files/folders are private/ignored
- `_routes.js` is folder metadata
- `.js` ESM files only
- route modules default-export explicit `route(...)` or `createRoutes(...)`

`_routes.js` may contribute:

- scoped hooks
- scoped contracts
- scoped metadata

Deferred route conventions:

- named `GET`/`POST` exports
- named `meta`/`loader`/`action` exports
- catch-all routes
- optional params
- route groups
- method-specific filenames
- layout/page conventions
- TypeScript route files
- lazy route modules

## 7. Generated output policy

Default generated output:

```txt
.potentia/routes.generated.js
```

Generated output must:

- be deterministic
- include a generated warning header in the future public implementation
- import explicit route modules
- import `createRoutes` and `mount` from the configured package name
- export explicit `createRoutes(...)`
- contain no runtime filesystem scanning
- not mutate global state
- not boot a server
- not execute route handlers during generation

Generated output should remain ignored by default and should not be shipped in the package.

## 8. Package identity policy

Default generated package import:

```txt
@potentiajs/core
```

`packageName` override remains part of the future public API.

Reasons:

- avoids stale package-name regressions
- supports self-import tests
- supports monorepo aliases/forks
- future-proofs deliberate package identity changes

Implementation should centralize or derive the default package identity and test it explicitly.

## 9. Diagnostics policy

Public diagnostics may be exposed in preview, but are experimental.

Policy:

- errors fail closed
- warnings may allow output
- ignored private files are reported separately
- collisions are errors
- unsupported future route syntax is an error
- no partial output on failure
- no raw stack traces by default

Initial public-ish diagnostic codes:

```txt
POTENTIA_FILE_ROUTE_COLLISION
POTENTIA_FILE_ROUTE_UNSUPPORTED_CATCH_ALL
POTENTIA_FILE_ROUTE_UNSUPPORTED_OPTIONAL_PARAM
POTENTIA_FILE_ROUTE_UNSUPPORTED_GROUP
POTENTIA_FILE_ROUTE_INVALID_PARAM
POTENTIA_FILE_ROUTE_MISSING_ROOT
POTENTIA_FILE_ROUTE_INVALID_OPTIONS
POTENTIA_FILE_ROUTE_WRITE_FAILED
```

Method-aware collision diagnostics are deferred until route module export validation is designed.

## 10. Manifest/source metadata policy

Future generated routes should include relative source metadata where safe:

```js
source: {
  kind: 'file-route',
  file: 'routes/users/[id].js'
}
```

Policy:

- use relative paths, not absolute paths
- route IDs remain method/path-based through `createRouteManifest(...)`
- route names are not auto-inferred yet
- file routing feeds existing route manifest APIs naturally
- no separate file-route manifest API initially

## 11. Deferred features

Deferred:

- public CLI
- watch mode
- config files
- package subpath implementation
- root export
- runtime `fromFiles()` helper
- production runtime scanning
- named method exports
- TypeScript route files
- catch-all/optional/group route syntax
- method-specific file naming
- route layouts/pages/frontend conventions
- lazy route loading
- route-name inference
- file-route manifest file output
- source maps/editor integrations

## 12. Required future implementation passes

Recommended next implementation block: **File Routing Public API Foundation**.

Suggested passes:

1. scope lock and no-runtime-scanning invariant
2. create package subpath source file
3. export `@potentiajs/core/file-routing`
4. move/promote only `generateFileRoutes(...)` as public preview API
5. keep low-level scanner/mapper/generator internal unless explicitly exported
6. add generated header
7. add relative source metadata if feasible
8. centralize package-name default as `@potentiajs/core`
9. add package-content checks proving subpath included and `src/dev/` not overexposed
10. update README with real usage only after implemented
11. verify tests, release check, and pack dry-run

## 13. Risks

- exposing low-level internals too early could freeze scanner/generator shapes
- named export conventions could imply frontend/full-stack semantics prematurely
- CLI implementation could create workflow commitments before registry publishing is clean
- stale package identity can break generated output in CI/publish workflows
- source metadata can leak absolute paths if not constrained
- route-name inference can create stability promises too early

## 14. Recommendation

Proceed later with **File Routing Public API Foundation**, not CLI.

Recommended implementation target:

```txt
@potentiajs/core/file-routing -> generateFileRoutes(...)
```

Keep:

- no root export
- no runtime filesystem scanning
- no public CLI yet
- explicit route composition as the source of truth

If release blockers become urgent first, pause file-routing implementation and run **Release Blocker Fix Pass**.

## Publish status

No publish command was run.
