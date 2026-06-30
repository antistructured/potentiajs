# Framework Inventory Audit

## Scope

This audit records the current repository state before framework expansion. It is documentation-only and does not classify any surface as ready for stabilization.

## Files inspected

- `package.json`
- `bun.lock`
- `README.md`
- `src/index.mjs`
- `cli/index.mjs`
- `cli/dev.mjs`
- `plugins/dsl-ui.mjs`
- `reactive.mjs`
- `ui.mjs`
- `examples/UserProfile.view`
- `potentia.config.mjs`
- top-level directories: `src/`, `cli/`, `plugins/`, `examples/`, `core/`, `node_modules/`, `.history/`, `.idea/`, `.vscode/`
- probed missing paths: `tests/`, `docs/` before this audit, `.github/workflows/`, `jsr.json`, `deno.json`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`

## Package identity

- Package name: `potentia-js`
- Version: `0.0.1`
- Private package: `true`
- Description: `A JavaScript library for anti-structured programming.`
- Author: `Daniel Weipert`
- License: `MIT`
- Repository metadata exists but has an empty URL.
- Bugs URL is placeholder-only (`https://`).

## Runtime target

- Runtime is Bun-first by current README and source usage.
- `src/index.mjs` imports `serve` from `bun` and starts a Bun HTTP server.
- `plugins/dsl-ui.mjs` uses the Bun global `Bun.file(...)` inside an esbuild plugin.
- `bun.lock` is present.
- No Deno, JSR, npm package-lock, pnpm lock, or yarn lock files are present.

## Package metadata and exports

Current `package.json` exposes:

- `main`: `index.js`
- `module`: `index.js`
- `exports`: not defined
- `bin`: not defined
- `scripts`: empty object
- `dependencies`: not defined
- `devDependencies`: empty object
- `peerDependencies`: empty object

Important mismatch:

- No root `index.js` file exists, so `main` and `module` currently point at a missing file.
- The actual source files are `.mjs` files, primarily `src/index.mjs`, `reactive.mjs`, and `ui.mjs`.
- No public export map exists, so package import behavior is not intentionally defined.

## Lockfile and dependency posture

- `bun.lock` lists `@types/bun`, `bun-types`, `@types/node`, `typescript`, and `undici-types`.
- `package.json` does not currently list these dependencies.
- Source imports `esbuild` in `cli/index.mjs`, but `esbuild` is not declared in `package.json` and was not present in `node_modules` during this audit.
- Runtime dependency posture is therefore unclear: package metadata claims no dependencies, but implementation expects Bun and the CLI expects esbuild.
- No runtime dependencies were added during this pass.

## Source layout

Current non-history project files:

- `src/index.mjs` — Bun server prototype; imports generated `../dist/app.js` and serves HTML.
- `plugins/dsl-ui.mjs` — experimental `.view` DSL compiler plugin for esbuild.
- `cli/index.mjs` — minimal CLI dispatcher for `dev` and `build` commands.
- `cli/dev.mjs` — dev-server/watch orchestration prototype.
- `ui.mjs` — browser DOM mounting/style/hook helpers.
- `reactive.mjs` — experimental reactive proxy/watch prototype.
- `examples/UserProfile.view` — sample view DSL file.
- `potentia.config.mjs` — empty config file.
- `core/rules/`, `core/runtime/`, `core/stream/`, `core/ui/` — directories exist but are empty.

## Examples state

- One `.view` example exists: `examples/UserProfile.view`.
- There are no JavaScript runnable examples or smoke-test examples.
- The current server expects a generated `dist/app.js`, but no `dist/` output is present.

## Tests and verification state

- No `tests/` directory exists.
- `bun test` found no tests and exited non-zero.
- No lint, check, type-check, or release-check scripts exist.
- No CI workflows exist under `.github/workflows/`.

## Documentation state

Before this sanity pass:

- README is the default Bun init-style text.
- No `docs/` directory existed.
- No API docs, architecture docs, stability docs, examples docs, or release docs existed.

## Release workflow state

- No Git repository was found at this path during audit (`git status` failed with `not a git repository`).
- No CI workflow files exist.
- `npm pack --dry-run --json` succeeds, but package contents include `.history/` snapshots and editor files because no `files` allowlist or `.npmignore` exists.
- Package is private, so current publish posture is not ready or intentional.

## Unknowns

- Whether `potentia-js` is the final package identity.
- Whether the source should be rooted at `src/index.mjs`, root `index.js`, or an export map.
- Whether `.history/` is intentionally part of the repository or an editor artifact to exclude later.
- Whether `core/*` directories are planned architecture or abandoned placeholders.
- Whether SigilJS should be external, workspace-local, or project-local for this package.
- Whether esbuild should remain part of the build pipeline.

## Pass 1 decisions

- Treat current implementation as prototype/exploratory until public entrypoints, tests, and docs are formalized.
- Do not change package metadata or dependencies in this sanity pass.
- Record generated/build output (`dist/app.js`) as missing rather than creating it.
