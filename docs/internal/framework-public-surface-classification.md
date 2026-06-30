# Framework Public Surface Classification

## Scope

This pass classifies every currently visible import path, command, config file, example, and documented behavior. Classification reflects current implementation, not intended future design.

## Files inspected

- `package.json`
- `README.md`
- `src/index.mjs`
- `cli/index.mjs`
- `cli/dev.mjs`
- `plugins/dsl-ui.mjs`
- `reactive.mjs`
- `ui.mjs`
- `examples/UserProfile.view`
- `potentia.config.mjs`
- `docs/internal/framework-inventory-audit.md`
- `docs/internal/framework-architecture-boundary-audit.md`

## Classification legend

- **stable** — intended public contract with tests/docs and compatibility expectation.
- **experimental** — visible or usable but not stable; behavior can change.
- **internal** — implementation detail; not intended for consumers.
- **legacy** — older supported surface kept for compatibility.
- **deprecated** — supported temporarily but planned for removal.
- **deferred** — not implemented yet.

## Public imports and package entrypoints

| Surface | Source | Classification | Evidence / issue |
| --- | --- | --- | --- |
| package import `potentia-js` via `main` | `package.json` -> `index.js` | deferred / broken | `index.js` does not exist. |
| package import via `module` | `package.json` -> `index.js` | deferred / broken | `index.js` does not exist. |
| `exports` map | `package.json` | deferred | Not defined. |
| `src/index.mjs` direct import/run | source file | experimental/internal | Starts server at top level and imports missing `../dist/app.js`. |
| `reactive.mjs` direct import | root source file | experimental | Exports `reactive` and `watch`, but implementation is incomplete and duplicate `watch` exists. |
| `ui.mjs` direct import | root source file | experimental | Exports DOM helpers; browser-only globals and module-level state. |
| `plugins/dsl-ui.mjs` direct import | plugin file | internal/experimental | Exports `compileDSL`; tied to esbuild plugin API and Bun global. |
| `cli/dev.mjs` direct import | CLI file | internal/experimental | Exports `startDevServer`; side-effect orchestration helper. |

No import surface qualifies as stable today.

## Exported symbols in source files

| Symbol | File | Classification | Notes |
| --- | --- | --- | --- |
| `compileDSL()` | `plugins/dsl-ui.mjs` | internal / experimental | Build-plugin helper for `.view`; no docs/tests. |
| `startDevServer()` | `cli/dev.mjs` | internal / experimental | Not exposed through package `bin`; currently references undefined `build` and `compileDSL` imports. |
| `reactive(target)` | `reactive.mjs` | experimental | Proxy mutation prototype; not integrated. |
| `watch(effect)` | `reactive.mjs` | experimental / unsafe | Declared/exported twice; final declaration queues effect but no dependency tracking. |
| `onMount(fn)` | `ui.mjs` | experimental | Global hook set. |
| `onDestroy(fn)` | `ui.mjs` | experimental | Global hook set. |
| `flushDestroyHooks()` | `ui.mjs` | experimental/internal | Clears all destroy hooks globally. |
| `mount(html, handlers)` | `ui.mjs` | experimental | Replaces `document.body.innerHTML`; event map convention undocumented. |
| `injectStyle(id, css)` | `ui.mjs` | experimental | Global style-id dedupe. |

## Public CLI commands

| Command | Source | Classification | Notes |
| --- | --- | --- | --- |
| package `bin` | `package.json` | deferred | No `bin` entry. |
| `node/bun cli/index.mjs dev` | `cli/index.mjs` | experimental/internal | Starts dev workflow if invoked directly. |
| `node/bun cli/index.mjs build` | `cli/index.mjs` | experimental/internal | Calls esbuild, but esbuild is not declared/present. |

No CLI command is stable or published as a package command.

## Public config files

| Surface | File | Classification | Notes |
| --- | --- | --- | --- |
| `potentia.config.mjs` | root | deferred / placeholder | Empty file; no loader found. |
| `package.json` metadata | root | internal/project metadata | Package is private and exports are currently broken. |

## Public runtime APIs

- Server runtime: **experimental** (`src/index.mjs` Bun server prototype).
- Frontend DOM runtime: **experimental** (`ui.mjs`).
- Reactivity runtime: **experimental** (`reactive.mjs`).
- Router: **deferred**.
- Contract/data-boundary runtime: **deferred**.
- Effect runtime: **deferred**.
- Adapter runtime: **deferred**.

## Public examples

| Example | Classification | Notes |
| --- | --- | --- |
| `examples/UserProfile.view` | experimental/prototype | Demonstrates a possible view DSL; references `fetchUser` without definition and requires compiler/build flow. |

## Documented behaviors

| Documentation | Classification | Notes |
| --- | --- | --- |
| README install/run instructions | legacy scaffold / stale | Default Bun init guidance; does not describe actual usable framework behavior. |
| README Bun runtime statement | accurate but incomplete | Bun runtime target is accurate. |
| Internal audit docs | internal | Created by this sanity pass as repo-state evidence. |

## Undocumented but exported surfaces

- `reactive`, `watch`, `onMount`, `onDestroy`, `flushDestroyHooks`, `mount`, `injectStyle`, `compileDSL`, and `startDevServer` are exported from direct source files but not documented in public docs.
- These are classified as experimental or internal rather than stable.

## Documented but missing surfaces

The project-level ambition mentions a full-stack framework, but the current public README does not claim concrete framework APIs. Missing from implementation relative to the strategic goal:

- Stable app/kernel creation API.
- Router declarations.
- Request/response contracts.
- Server action/RPC contracts.
- Effect workflows.
- Runtime adapters.
- Frontend component/runtime contract.
- Public CLI package command.

## Pass 3 decisions

- Stable surface set is currently empty.
- Existing visible source-level exports remain experimental/internal until package exports, docs, and tests are added.
- Package entrypoint metadata must be fixed in a later build/release block before any public API can be considered stable.
