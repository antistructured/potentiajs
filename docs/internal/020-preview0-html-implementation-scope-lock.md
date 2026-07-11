# 0.2.0-preview.0 HTML Implementation Scope Lock

## Files inspected

- `docs/internal/020-roadmap-report.md`
- `docs/internal/020-html-public-api-proposal.md`
- `docs/internal/020-html-compat-safety-review.md`
- `package.json`
- `jsr.json`
- `src/`
- `tests/`
- `examples/`
- `README.md`
- `CHANGELOG.md`

## Target version

```txt
0.2.0-preview.0
```

No version bump occurs until Pass 10.

## New subpath

```txt
@potentiajs/core/html
```

Preview.0 public exports:

- `html`
- `raw`
- `escapeHtml`
- `attrs`
- `fragment`
- `htmlResponse`

## Allowed scope

- `src/html.js`
- `src/html.d.ts`
- `package.json` exports and version later in the block
- `jsr.json` exports and version later in the block
- tests for HTML primitives
- `examples/html-basic`
- README docs for HTML-first responses
- CHANGELOG entry for `0.2.0-preview.0`
- internal implementation docs

## Forbidden

- JSX
- compiler
- template file format
- client runtime
- hydration
- virtual DOM
- SPA router
- CSS system
- component model
- web components abstraction
- root export pollution
- route/action/form behavior changes unless a direct compatibility blocker appears
- manual publish

## Root export policy

HTML helpers must not be exported from `src/index.js` in preview.0.

## Blockers

None.
