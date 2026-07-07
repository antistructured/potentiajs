# File Routing Public API Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/dev/file-routing/index.js`
- `src/dev/file-routing/path-mapping.js`
- `src/dev/file-routing/scanner.js`
- `src/dev/file-routing/diagnostics.js`
- `src/dev/file-routing/generator.js`
- `src/dev/file-routing/writer.js`
- `scripts/generate-file-routes.js`
- `tests/file-routing-*.test.js`
- `docs/internal/file-routing-design-gate-report.md`
- `docs/internal/file-routing-projection-prototype-report.md`
- `docs/internal/file-routing-dev-tool-wrapper-report.md`
- `docs/internal/public-preview-readiness-regate-report.md`
- `docs/internal/post-release-verification-scope-lock.md`
- `sigiljs-build-block` reference: `references/potentia-file-routing-design.md`

## Scope lock

This block is a design gate for the future public file-routing API. It decides the public shape before any new public API is exposed.

Allowed in this block:

- internal design documents under `docs/internal/`
- README honesty update that says the public API is designed but not implemented
- final verification commands

Forbidden in this block:

- no source implementation
- no root export addition
- no package subpath export addition
- no CLI/bin addition
- no package metadata version/name change
- no runtime dependency or dev dependency addition
- no publish workflow fix
- no npm/JSR publish or dry-run publish command
- no frontend runtime, form renderer, client SDK, OpenAPI, DB/auth, package split, or compiler work

## Current internal file-routing behavior

The current internal/dev-only system already has:

- path mapper for `.js` route files
- scanner that reads a route tree and returns routes/scopes/ignored/errors
- deterministic diagnostics
- generator that emits explicit route composition
- writer helper `generateFileRoutes({ rootDir, outputFile, packageName, cwd })`
- internal script wrapper `bun run generate:file-routes`
- generated output target `.potentia/routes.generated.js`
- internal checks through `tests/file-routing-*.test.js`

Current supported internal conventions:

- `routes/index.js` -> `/`
- `routes/users/index.js` -> `/users`
- `routes/users/[id].js` -> `/users/:id`
- nested folders become nested path segments
- `_`-prefixed files/folders ignored except `_routes.js`
- `.js` ESM route files only
- `_routes.js` folder metadata
- generated output imports `createRoutes` and `mount`

## Current package identity assumptions

Current local package metadata says:

- package: `@potentiajs/core`
- version: `0.1.0-preview.0`

Post-release verification found registry/publish blockers parked outside this design gate:

- npm package not visible
- JSR package shell exists but no version is visible
- recent GitHub CI/Publish failures were related to stale generated file-routing package name assumptions

## Public API absence

Current `package.json` exports only the root package entry:

```json
{
  ".": {
    "types": "./src/index.d.ts",
    "import": "./src/index.js"
  }
}
```

There is no public file-routing root export, no public subpath export, and no public CLI/bin.

## Stale package-name risk

The old internal reports mention `potentia-js` or `potentiajs`. The current package identity is `@potentiajs/core`.

Design decision pressure: any future generator public surface must default generated imports to `@potentiajs/core` and also allow an explicit `packageName` override for local tests, monorepo linking, and future package moves.

## What remains internal

Until a future implementation block explicitly promotes it:

- `src/dev/file-routing/*`
- `scripts/generate-file-routes.js`
- `.potentia/routes.generated.js`
- file-routing diagnostics and scanner objects
- internal examples and fixtures

## Implementation deferred

This block does not add or expose:

- `@potentiajs/core/file-routing`
- `@potentiajs/core/dev`
- `generateFileRoutes(...)` as a package subpath
- `potentia routes generate`
- watch mode
- public manifest generation from files
- catch-all/optional/group route support
- TypeScript route file support

## Decision

Proceed with design only. Public file routing should remain projection over explicit route composition and must not introduce production runtime filesystem scanning, hidden registration, implicit server boot, or global route mutation.

## Publish status

No publish command was run.
