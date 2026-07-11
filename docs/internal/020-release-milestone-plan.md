# 0.2.0 Release Milestone Plan

## 0.2.0-preview.0 — Core HTML primitives

Theme:

```txt
HTML-first foundation
```

Scope:

- add `@potentiajs/core/html` subpath
- add source and type files:
  - `src/html.js`
  - `src/html.d.ts`
- update exports:
  - `package.json` `exports["./html"]`
  - `jsr.json` `exports["./html"]`
- add core helpers:
  - `html`
  - `raw`
  - `escapeHtml`
  - `attrs`
  - `fragment`
  - `htmlResponse`
- add tests for:
  - default escaping
  - raw trusted insertion
  - attribute escaping/omission/boolean behavior
  - child flattening
  - response content type/status/headers
  - root export cleanliness
  - subpath import
- add `examples/html-basic`
- update README with a small HTML helper section
- add changelog preview entry
- run full release checks:
  - `bun run test`
  - `bun run check:release`
  - `npm pack --dry-run --json`
  - `npx jsr publish --dry-run --allow-dirty`

Non-goals:

- no root export
- no JSX
- no compiler
- no page/layout yet unless implementation is trivial and explicitly approved
- no form renderer rewrite

Exit criteria:

- subpath import works from source and packed artifact
- npm/JSR dry-runs include the new subpath correctly
- no root pollution
- examples run

## 0.2.0-preview.1 — Page/layout/example integration

Theme:

```txt
Application HTML composition
```

Scope:

- add `page(...)` helper if preview.0 foundation is stable
- add `layout(...)` helper if a small non-component shape is clear
- add basic document shell behavior:
  - doctype
  - html/head/body
  - title
  - lang
  - head/body children
- document form renderer interop:
  - likely `raw(renderForm(...))` initially
  - optionally brand `renderForm(...)` output only if clearly safe and compatible
- update `examples/full-flow-basic` after API stabilizes
- strengthen README examples
- add changelog preview entry
- run full release checks and packed install smoke

Non-goals:

- no asset pipeline
- no CSS system
- no client runtime
- no component lifecycle
- no web components abstraction

Exit criteria:

- page/layout helpers improve real examples without changing framework identity
- full-flow example remains server-first and regular-HTML form based
- safety tests still pass

## 0.2.0 final — Docs polish and registry verification

Theme:

```txt
Stable ZeroVer capability release
```

Scope:

- finalize README and CHANGELOG
- bump version to `0.2.0`
- run full local release gate
- publish through GitHub workflow
- verify npm latest -> `0.2.0`
- verify npm preview remains historical unless intentionally updated by preview releases
- verify JSR sees `0.2.0`
- run fresh install smoke:
  - root import
  - file-routing import
  - forms import
  - html import
  - CLI smoke
  - generated routes smoke
  - HTML response smoke
- record final release report under `docs/internal/`

Exit criteria:

- npm and JSR public registries show `0.2.0`
- HTML subpath works from public install
- no root pollution
- no JSX/compiler/hydration-first identity drift

## Blockers

None for roadmap.

Implementation should begin with `0.2.0-preview.0` only after this roadmap is accepted.
