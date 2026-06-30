# Framework Architecture Boundary Audit

## Scope

This pass maps the architecture that exists now. It does not introduce new layers or repair prototypes.

## Files inspected

- `src/index.mjs`
- `cli/index.mjs`
- `cli/dev.mjs`
- `plugins/dsl-ui.mjs`
- `reactive.mjs`
- `ui.mjs`
- `examples/UserProfile.view`
- `README.md`
- `package.json`
- current directory structure under `core/`, `src/`, `cli/`, `plugins/`, and `examples/`

## Current layer map

| Area | Current files | Classification | Notes |
| --- | --- | --- | --- |
| Core kernel | none proven; empty `core/*` directories | deferred | No central app/kernel abstraction exists. |
| Server runtime | `src/index.mjs` | experimental prototype | Starts a Bun server at import/run time and hard-codes port `3000`. |
| Frontend runtime | `ui.mjs` | experimental prototype | Direct DOM mutation helpers; assumes browser globals. |
| Router | none | deferred | No route declaration, params, nested routing, or dispatch model exists. |
| Contracts | none | deferred | No SigilJS usage, validation, schemas, or boundary contracts exist. |
| Effects/workflows | `cli/dev.mjs`, server fetch callback | experimental/internal | I/O orchestration exists but is not modeled as explicit effect workflows. |
| Streams/reactivity | `reactive.mjs` | experimental prototype | Proxy/watch prototype; currently not wired to UI/server. |
| Compiler/staging | `plugins/dsl-ui.mjs`, `cli/index.mjs` build command | experimental prototype | `.view` DSL compiler is regex-based and coupled to esbuild/Bun globals. |
| CLI | `cli/index.mjs`, `cli/dev.mjs` | experimental/internal | No package `bin`; commands are not public. |
| Adapters | Bun server import; esbuild plugin | experimental/internal | Bun and esbuild are hard-coded, not adapter boundaries. |
| Internal utilities | none clearly separated | deferred | Utilities are embedded in prototypes. |
| Examples/prototypes | `examples/UserProfile.view` | experimental example | Shows intended DSL direction but depends on unproven compiler/server path. |

## Functional core vs imperative shell

Current code is mostly imperative shell:

- `src/index.mjs` performs server startup at module top level.
- `cli/dev.mjs` spawns processes, watches the filesystem, handles SIGINT, and rebuilds output.
- `plugins/dsl-ui.mjs` performs file reads via `Bun.file` inside build plugin callbacks.
- `ui.mjs` writes directly to `document.body`, `document.head`, element event handlers, and global hook sets.
- `reactive.mjs` mutates proxy targets and stores dependency state in module-level structures.

Functional-core candidates exist but are not isolated yet:

- `compileViewFile(source)` is a pure-ish compiler helper, but it is private to `plugins/dsl-ui.mjs` and regex-based.
- Some HTML string generation is deterministic, but it is generated dynamically rather than exposed as a framework kernel.

## I/O boundaries

Known I/O locations:

- HTTP server and responses: `src/index.mjs`
- Filesystem reads: `plugins/dsl-ui.mjs` via `Bun.file`
- Filesystem watching: `cli/dev.mjs` via `fs.watch`
- Process spawning/signals: `cli/dev.mjs` via `child_process.spawn` and `process.on`
- Console logging/errors: `src/index.mjs`, `cli/index.mjs`, `cli/dev.mjs`
- DOM writes/event handler assignment: `ui.mjs`

These I/O boundaries are not yet abstracted behind adapters or effect descriptions.

## Hidden/global state

- `ui.mjs` has module-level `mountHooks`, `destroyHooks`, and `injectedStyles` sets.
- `reactive.mjs` has module-level `targetMap`, `activeEffect`, `updateQueue`, and `scheduled` state.
- `cli/dev.mjs` has module-level `proc` for the currently spawned server.
- `src/index.mjs` starts a server as a module side effect.

## Dynamic mutation and shape stability concerns

- `reactive(target)` returns a `Proxy` and mutates the original target object in `set`.
- `ui.mjs` mutates `document.body.innerHTML` and assigns dynamic `on${event}` properties.
- `plugins/dsl-ui.mjs` emits JavaScript strings from regex extraction and template replacement.
- `examples/UserProfile.view` references `fetchUser(userId)` without defining/importing it.
- `reactive.mjs` exports `watch` twice; the later export shadows/duplicates the earlier declaration and indicates unresolved prototype state.
- `reactive.mjs` defines `track(...)` but does not call it from the proxy `get`, so dependency tracking is incomplete.

## Framework lock-in

- Runtime is currently Bun-specific (`import { serve } from 'bun'`, `Bun.file(...)`, `bun.lock`).
- Build flow is currently esbuild-specific but esbuild is undeclared in `package.json`.
- Browser UI helpers assume direct DOM access.
- No adapter interface exists for alternate runtimes, bundlers, or rendering targets.

## Experimental surfaces to preserve as experimental

- `.view` DSL and compiler plugin.
- `ui.mjs` DOM mount/lifecycle/style helpers.
- `reactive.mjs` reactive/watch implementation.
- `cli` dev/build commands.
- `src/index.mjs` Bun server entrypoint.

## Missing architecture layers

- App/kernel object or pure route tree.
- Route declaration and matching.
- Request/response normalization.
- Contract validation boundary layer.
- Error/result shape conventions.
- Effect execution model.
- Adapter interface for Bun serving.
- Public package entrypoint.
- Test harness and example smoke harness.

## Pass 2 decisions

- Current code is exploratory and should not be treated as a coherent framework kernel yet.
- The next build block should start with the smallest server/kernel boundary rather than frontend runtime expansion.
- Keep prototype UI/reactive/compiler layers out of stable surface until they are tested and documented.
