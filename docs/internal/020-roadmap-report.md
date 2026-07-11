# 0.2.0 Roadmap Report

## Outcome

The recommended `0.2.0` track is:

```txt
HTML-first response/view foundation
```

This roadmap expands PotentiaJS from a verified public framework kernel into a more usable server-first application framework without changing its identity.

No implementation, version bump, publish, compiler, JSX, or API change was performed in this block.

## Pass 1 — Post-0.1.0 Housekeeping

Created:

- `docs/internal/020-post-010-housekeeping.md`

Decisions:

- commit `docs/internal/010-*.md` as release audit trail: already satisfied by existing release-doc commit history
- leave `.trunk/` untracked unless deliberately adopted in a separate tooling pass
- keep package and JSR version at `0.1.0`
- do not bump to `0.2.0` during roadmap work

## Pass 2 — 0.2.0 Theme Selection

Created:

- `docs/internal/020-theme-selection.md`

Decision:

- primary: HTML-first response/view foundation
- secondary: docs/examples adoption support

Deferred:

- app/plugin maturity
- resource/data conventions
- dev server/watch mode
- docs-only adoption release
- JSX/compiler/client-runtime work

## Pass 3 — HTML-First View Layer Scope

Created:

- `docs/internal/020-html-first-view-layer-scope.md`

Included:

- safe HTML value
- escaping
- explicit trusted raw HTML
- attrs helper
- fragment helper
- HTML response helper
- page helper in preview.1
- layout helper in preview.1
- document shell in preview.1
- form renderer integration in preview.1
- example app update

Excluded:

- JSX
- compiler
- template file format
- client runtime
- hydration
- virtual DOM
- SPA routing
- CSS system
- component model
- web components abstraction
- hidden runtime filesystem scanning
- asset pipeline

## Pass 4 — Public API Proposal

Created:

- `docs/internal/020-html-public-api-proposal.md`

Subpath:

```txt
@potentiajs/core/html
```

Proposed exports:

- `html`
- `raw`
- `escapeHtml`
- `attrs`
- `fragment`
- `htmlResponse`
- `page` in preview.1
- `layout` in preview.1

Root exports:

- none for `0.2.0-preview.0`

Key decisions:

- subpath only
- no root export yet
- prefer tagged-template `html` first
- allow `raw(...)`, but deliberately dangerous/trusted
- choose `htmlResponse` over `respondHtml`

Open API decisions for implementation:

- exact safe HTML branding/type
- whether plain strings passed to `htmlResponse` escape or throw
- whether `attrs` supports class arrays in preview.0
- exact `page` / `layout` shape

## Pass 5 — Compatibility / Safety Review

Created:

- `docs/internal/020-html-compat-safety-review.md`

Compatible with:

- route handlers
- existing response helpers
- forms renderer
- actions/forms failure states
- file-routing generated routes
- Bun `Response`
- Node-compatible web `Response`
- JSR artifact posture
- npm artifact posture
- plain JS no-dependency posture

Safety rules:

- escape by default
- raw requires explicit trusted wrapper
- validate/escape attribute names and values
- boolean attrs render only when true
- null/undefined attrs omitted
- children flatten recursively
- arrays/fragments do not comma-join
- default `Content-Type`: `text/html; charset=utf-8`

Risks:

- XSS through misuse of `raw(...)`
- over-designing a component model
- root API pollution
- form renderer interop ambiguity
- npm/JSR export drift

Mitigations:

- dangerous raw naming and docs warning
- preview.0 low-level primitives only
- subpath-only export
- explicit `raw(renderForm(...))` interop initially
- release-gate export/artifact checks

## Pass 6 — Example Strategy

Created:

- `docs/internal/020-html-example-strategy.md`

Existing examples:

- leave `examples/file-routing-basic` focused on file-routing
- leave `examples/form-rendering-basic` focused on forms
- update `examples/full-flow-basic` only after HTML API stabilizes, likely preview.1

New examples:

- add `examples/html-basic` in preview.0

Deferred examples:

- full-flow HTML/page/layout integration in preview.1
- richer README/tutorial docs during final polish

## Pass 7 — Release Milestone Plan

Created:

- `docs/internal/020-release-milestone-plan.md`

### 0.2.0-preview.0

Core HTML primitives:

- `@potentiajs/core/html` subpath
- `src/html.js`
- `src/html.d.ts`
- `html`
- `raw`
- `escapeHtml`
- `attrs`
- `fragment`
- `htmlResponse`
- tests
- `examples/html-basic`
- README/changelog preview docs
- npm pack + JSR dry-run verification

### 0.2.0-preview.1

Application composition:

- `page(...)`
- `layout(...)`
- document shell
- form renderer interop docs/example
- update `examples/full-flow-basic`
- packed install smoke

### 0.2.0 final

Release polish:

- README/CHANGELOG finalization
- version bump to `0.2.0`
- full release gate
- GitHub publish workflow
- npm/JSR public registry verification
- fresh install/import/CLI/generated-routes/HTML smoke
- final release report

## 0.2.0 theme

- primary: HTML-first response/view foundation
- secondary: docs/examples adoption support

## Public API proposal

- subpath: `@potentiajs/core/html`
- exports: `html`, `raw`, `escapeHtml`, `attrs`, `fragment`, `htmlResponse`, later `page`, `layout`
- root exports: none initially

## Included

- safe HTML values
- escaping by default
- explicit raw trust boundary
- attrs/fragment composition
- HTML responses
- page/layout after foundation
- examples and docs support

## Excluded

- JSX
- compiler
- hydration
- client runtime
- virtual DOM
- React-like identity
- SPA routing
- CSS system
- component model
- database/resource conventions
- dev server/watch as primary theme

## Examples

- add `examples/html-basic` in preview.0
- update `examples/full-flow-basic` in preview.1 after API stabilizes
- leave file-routing and form-rendering examples focused

## Milestones

- preview.0: core HTML primitives
- preview.1: page/layout/example integration
- final: docs polish and registry verification

## Remaining blockers

None for roadmap.

Implementation still needs focused API decisions during `0.2.0-preview.0` for safe HTML branding, `htmlResponse` string behavior, and `attrs` class sugar.

## Recommendation

Begin `0.2.0-preview.0` HTML Foundation Implementation Pass.
