# File Routing Dev Tool Wrapper Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`

## 2. Current version

- `0.0.1`

## 3. Scope completed

Completed:

- dev wrapper scope lock
- internal writer helper
- internal generation script
- `.potentia/` ignore/package hygiene
- deterministic regeneration tests
- internal/dev workflow example
- README update
- package check

Not performed:

- public CLI/bin field
- package export subpath
- public file-routing API
- `fromFiles()`
- watch mode
- compiler integration
- runtime filesystem scanning
- kernel changes
- frontend/layout support
- TypeScript conversion
- publish prep

## 4. Writer helper behavior

Implemented in `src/dev/file-routing/writer.js`:

```js
generateFileRoutes({ rootDir, outputFile, packageName, cwd })
```

Behavior:

- scans route tree
- generates module source
- fails closed on scan/generation errors
- creates output directory
- writes through temporary file + rename
- preserves previous valid generated output when regeneration fails before write
- returns deterministic result metadata
- does not import or execute route modules

## 5. Script wrapper behavior

Implemented in `scripts/generate-file-routes.js`.

Package script:

```bash
bun run generate:file-routes
```

Defaults:

- root: `routes`
- output: `.potentia/routes.generated.js`
- package name: `potentia-js`

Tiny args:

```bash
--root <path>
--out <path>
--package <name>
```

The script is intentionally internal, dependency-free, and non-watch.

## 6. Ignore/package hygiene

`.gitignore` now includes:

```txt
.potentia/
```

Package `files` remains an allowlist and excludes:

- `.potentia/`
- tests
- `docs/internal/`
- `src/dev/file-routing/`
- generated example output

## 7. Regeneration behavior

Regeneration tests prove:

- running writer twice produces identical output
- successful regeneration overwrites stale output
- failed regeneration preserves previous valid output
- no partial temp output remains
- route discovery order is deterministic
- output directory creation is deterministic

## 8. Dev workflow example

Added `examples/file-routing-dev/` with:

- `routes/index.js`
- `routes/users/index.js`
- `routes/users/[id].js`
- `routes/users/_routes.js`
- `index.js` consuming `./.potentia/routes.generated.js`
- README marking the workflow internal/dev-only

The smoke test generates routes before importing the example app and cleans `.potentia/` afterward.

## 9. Tests added/updated

Added:

- `tests/file-routing-writer.test.js`
- `tests/file-routing-script.test.js`
- `tests/file-routing-regeneration.test.js`
- `tests/file-routing-dev-example.test.js`

Updated existing generator behavior to support custom internal package name output.

## 10. Deferred features

- public CLI/bin
- stable public file-routing API
- package export subpath
- `fromFiles()`
- watch mode
- compiler integration
- production runtime filesystem scanning
- kernel integration
- catch-all routes
- optional params
- route groups
- method-aware collision detection
- route module export-shape validation
- frontend/layout support
- publish prep

## 11. Recommendation

Next best block: **Effect DX Helpers**, if publish decisions remain deferred.

File-routing can pause here with a usable internal generation workflow. Future file-routing blocks should only proceed to public API/CLI stabilization after the owner explicitly approves a public surface and package contents strategy.
