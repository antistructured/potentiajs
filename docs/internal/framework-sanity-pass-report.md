# Framework Sanity Pass Report

## 1. Current project/package name

- Package name: `potentia-js`
- README title: `potentia`
- Package is currently private.

## 2. Current version

- `0.0.1`

## 3. Runtime target

- Bun-first JavaScript runtime.
- Plain JavaScript / `.mjs` source.
- ES module syntax is used in source files.
- No TypeScript source exists.

## 4. Source posture

Current source is exploratory/prototype code:

- `src/index.mjs` starts a Bun server at top level and imports generated `../dist/app.js`.
- `ui.mjs` contains browser DOM mount/lifecycle/style helpers.
- `reactive.mjs` contains a reactive/watch prototype with duplicate `watch` exports and incomplete dependency tracking.
- `plugins/dsl-ui.mjs` contains a regex-based `.view` compiler plugin.
- `cli/index.mjs` and `cli/dev.mjs` contain prototype dev/build orchestration.
- `core/*` directories exist but are empty.

## 5. Dependency posture

- `package.json` declares no runtime dependencies and empty dev/peer dependencies.
- `bun.lock` contains Bun/TypeScript-related packages from a prior install state.
- `cli/index.mjs` imports `esbuild`, but `esbuild` is not declared and was not found in `node_modules` during audit.
- SigilJS is not currently installed, declared, imported, or used.
- No dependencies were added in this sanity pass.

## 6. Existing architecture

Current architecture is not yet a coherent framework kernel. It is a set of prototypes:

- Server prototype: `src/index.mjs`
- UI prototype: `ui.mjs`
- Reactivity prototype: `reactive.mjs`
- DSL/compiler prototype: `plugins/dsl-ui.mjs`
- CLI prototype: `cli/*`
- Example prototype: `examples/UserProfile.view`

Functional core and imperative shell are not separated yet. Most I/O and global state live directly in modules.

## 7. Existing public surfaces

Visible but not stable:

- Direct source imports from `src/index.mjs`, `reactive.mjs`, `ui.mjs`, `plugins/dsl-ui.mjs`, and `cli/dev.mjs`.
- Manual CLI invocation via `cli/index.mjs dev` or `cli/index.mjs build`.
- `examples/UserProfile.view` as a prototype view file.
- `potentia.config.mjs` as an empty placeholder.

Package metadata claims `main` and `module` are `index.js`, but that file does not exist.

## 8. Stable surfaces

Current stable surface set: **empty**.

No import, CLI, config, runtime API, example, or documented behavior currently has enough package metadata, tests, docs, and compatibility evidence to be stable.

## 9. Experimental surfaces

- Bun server prototype in `src/index.mjs`.
- DOM helpers in `ui.mjs`.
- Reactive/watch prototype in `reactive.mjs`.
- `.view` DSL and esbuild plugin in `plugins/dsl-ui.mjs`.
- CLI dev/build orchestration in `cli/*`.
- `examples/UserProfile.view`.

## 10. Internal surfaces

- `compileDSL()` and private `compileViewFile(...)` in `plugins/dsl-ui.mjs`.
- `startDevServer()` in `cli/dev.mjs`.
- Any direct build/watch/spawn behavior in `cli/*`.
- Internal audit docs under `docs/internal/`.

## 11. Deferred surfaces

- Framework kernel.
- Router.
- Route params/query/body/response contracts.
- Stable result/error envelopes.
- Effect workflow runtime.
- Runtime adapter interface.
- Frontend runtime stabilization.
- Database helper/layer.
- AI/LLM helper/layer.
- Package entrypoint/export map.
- Public CLI command.
- CI/release workflow.

## 12. SigilJS integration readiness

SigilJS is not currently integrated. The repo is conceptually ready for a contract-first design, but the integration should start only after a minimal kernel boundary exists.

Recommended first SigilJS surfaces:

1. Route params.
2. Query params.
3. Request body.
4. Response body.
5. Stable handler result/error shape.
6. Bun request adapter normalization.

Recommended dependency posture for a separate framework package is peer dependency plus dev dependency, not an opaque bundled runtime dependency. No dependency changes were made in this block.

## 13. Test/verification status

Current status: **not able to prove behavior yet**.

Observed verification:

- `bun run lint`: unavailable (`Script not found "lint"`).
- `bun test`: failed because no tests exist.
- `bun run check`: unavailable.
- `bun run check:types`: unavailable.
- `npm pack --dry-run --json`: exits `0`, but package contents include `.history/` and editor files.

Additional blockers:

- `src/index.mjs` expects missing `../dist/app.js`.
- `cli/index.mjs` expects undeclared/missing `esbuild`.
- No CI workflows exist.

## 14. Docs status

Before this pass, README was Bun init-style scaffolding. This pass updated README to reflect true current status and added internal docs:

- `docs/internal/framework-inventory-audit.md`
- `docs/internal/framework-architecture-boundary-audit.md`
- `docs/internal/framework-public-surface-classification.md`
- `docs/internal/sigiljs-contract-integration-audit.md`
- `docs/internal/framework-test-verification-audit.md`
- `docs/internal/framework-sanity-pass-report.md`

## 15. Files changed

- `README.md`
- `docs/internal/framework-inventory-audit.md`
- `docs/internal/framework-architecture-boundary-audit.md`
- `docs/internal/framework-public-surface-classification.md`
- `docs/internal/sigiljs-contract-integration-audit.md`
- `docs/internal/framework-test-verification-audit.md`
- `docs/internal/framework-sanity-pass-report.md`

No source code, dependency, package metadata, or lockfile changes were made.

## 16. Decisions made

- Classify current implementation as exploratory/prototype rather than stable framework kernel.
- Keep all currently visible APIs experimental or internal.
- Treat package entrypoint metadata as broken/deferred until a later build block.
- Do not add SigilJS or any other dependency during this audit.
- Do not implement router, runtime, CLI, package split, frontend runtime, or server kernel features in this block.
- Recommend grounding the next block in a minimal Bun-native server/kernel slice.

## 17. Remaining blockers

- No Git repository found at this path during audit.
- No tests, lint, type checks, release checks, or CI.
- Broken package entrypoint metadata (`index.js` missing).
- Missing generated `dist/app.js` for current server prototype.
- Undeclared/missing `esbuild` for CLI build command.
- `.history/` and editor metadata included in pack output.
- No SigilJS contract integration.
- No router/kernel/effect/result model.
- No stable public API surface.

## 18. Recommended next block

### Framework Kernel Foundation — Manual Virtual Sub-Agent Workflow

Build or harden the smallest Bun-native framework kernel that can prove:

- route declaration model
- Bun-native HTTP serving
- SigilJS request contracts for params/query/body
- SigilJS response contracts
- effect-oriented request handling
- stable result/error shapes
- minimal app bootstrap
- first installable/smoke-testable example

Do not introduce frontend complexity, package splitting, TypeScript source conversion, or broad CLI expansion in that next block.

## Constraint confirmation

This sanity pass respected the requested constraints:

- Plain JavaScript source preserved.
- ES module posture preserved.
- Bun-first target preserved.
- No TypeScript conversion.
- No runtime dependencies added.
- No package/service split.
- No feature expansion.
- Documentation-only changes, plus README status correction.
