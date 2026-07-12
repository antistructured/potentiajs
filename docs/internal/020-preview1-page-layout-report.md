# 0.2.0-preview.1 Page/Layout Integration Report

## Outcome

Implemented the preview.1 server-first page composition layer for:

```txt
@potentiajs/core/html
```

Prepared version:

```txt
0.2.0-preview.1
```

No manual publish was run.

## Pass 1 — Page/Layout Scope Lock

Created:

- `docs/internal/020-preview1-page-layout-scope-lock.md`

Scope locked to:

- `page(...)`
- `layout(...)`
- subpath-only `@potentiajs/core/html`
- examples/tests/docs/version prep

Forbidden and preserved:

- no JSX
- no compiler
- no client runtime
- no hydration
- no virtual DOM
- no component model
- no CSS system
- no route/action/form behavior changes beyond example usage composition

## Pass 2 — API Shape Decision

Created:

- `docs/internal/020-preview1-page-layout-api-decision.md`

Final `layout(...)` shape:

```js
layout(render) -> (props?) => HtmlValue
```

Final `page(...)` shape:

```js
page({
  title,
  lang = 'en',
  head,
  body,
  children,
  htmlAttrs,
  bodyAttrs
}) -> HtmlValue
```

Decisions:

- `layout(render)` requires a function.
- layout render result is normalized to safe HTML.
- `page(...)` returns `HtmlValue`, not `Response`.
- Compose responses with `htmlResponse(page(...))`.
- doctype, charset, viewport, and default `lang="en"` are included by default.
- title escapes by default.
- head/body accept safe/plain children.
- `children` aliases body.
- body wins over children.

## Pass 3 — Layout Helper Implementation

Created:

- `docs/internal/020-preview1-layout-implementation.md`

Changed:

- `src/html.js`

Implemented:

- `layout(render)`

Behavior:

- non-functions throw `TypeError`
- returns render function
- omitted props default to `{}`
- passes props through unchanged
- safe HTML preserved
- plain strings escaped
- arrays flatten
- null/undefined render empty
- render errors propagate

## Pass 4 — Page Helper Implementation

Created:

- `docs/internal/020-preview1-page-implementation.md`

Changed:

- `src/html.js`

Implemented:

- `page(options)`

Behavior:

- returns safe HTML value
- includes `<!doctype html>`
- includes `<html>` / `<head>` / `<body>`
- default `lang="en"`
- supports `htmlAttrs`
- supports `bodyAttrs`
- includes charset meta
- includes viewport meta
- supports escaped title
- supports head/body children
- supports children alias
- body wins over children
- does not return `Response`

## Pass 5 — Types + Exports

Created:

- `docs/internal/020-preview1-types-exports.md`

Changed:

- `src/html.d.ts`

Types added:

- `PageOptions`
- `LayoutRenderer`
- `layout(...)`
- `page(...)`

Exports:

- existing `./html` package export covers runtime/types
- existing `./html` JSR export covers runtime
- no new subpath needed
- no root export added

## Pass 6 — Tests

Created:

- `docs/internal/020-preview1-page-layout-tests.md`

Changed:

- `tests/html.test.js`

Focused result:

```txt
31 pass
0 fail
71 expect() calls
```

Coverage added for:

- layout validation
- layout props
- layout escaping/preservation/flattening/nullish behavior/error propagation
- page default shell
- lang/htmlAttrs/bodyAttrs
- title/head/body safety
- children alias
- body precedence
- htmlResponse composition
- subpath import
- root export non-pollution

## Pass 7 — HTML Basic Example Update

Created:

- `docs/internal/020-preview1-html-basic-example-update.md`

Changed:

- `examples/html-basic/index.js`
- `examples/html-basic/README.md`

Example now demonstrates:

- `layout(...)`
- `page(...)`
- `htmlResponse(page(...))`
- `attrs(...)`
- `fragment(...)`
- `raw(...)`
- escaped user content

Validation:

```bash
bun run examples/html-basic/index.js
```

Result:

- status `200`
- content type `text/html; charset=utf-8`
- body includes `<!doctype html>`
- layout-rendered `<main>` present
- unsafe user text escaped
- trusted raw HTML preserved only through `raw(...)`

## Pass 8 — Full-Flow Example Integration

Created:

- `docs/internal/020-preview1-full-flow-html-integration.md`

Changed:

- `examples/full-flow-basic/form.js`
- `examples/full-flow-basic/README.md`

Integration:

- imports `html`, `htmlResponse`, `layout`, `page`, and `raw` from `@potentiajs/core/html`
- uses `layout(...)` for shared page body shell
- uses `page(...)` for document shell
- uses `htmlResponse(page(...))` for responses
- uses `raw(renderForm(...))` for trusted server-rendered form HTML
- preserves route/action/form behavior

Focused result:

```txt
1 pass
0 fail
35 expect() calls
```

## Pass 9 — Version / Changelog Prep

Created:

- `docs/internal/020-preview1-version-changelog.md`

Changed:

- `package.json`
- `jsr.json`
- `CHANGELOG.md`
- `README.md`

Version:

- previous: `0.2.0-preview.0`
- current: `0.2.0-preview.1`

Version match check:

```txt
0.2.0-preview.1
```

## Full Release Verification

Commands run:

```bash
bun run test
bun run check:release
npm pack --dry-run --json
npx jsr publish --dry-run --allow-dirty
node -e 'const p=require("./package.json"); const j=require("./jsr.json"); if (p.version !== j.version) throw new Error(`${p.version} !== ${j.version}`); console.log(p.version)'
bun run examples/html-basic/index.js
bun test tests/full-flow-basic-example.test.js
```

### Tests

```txt
640 pass
0 fail
1558 expect() calls
Ran 640 tests across 86 files.
```

### check:release

Passed.

### npm pack

Package:

- name: `@potentiajs/core`
- version: `0.2.0-preview.1`
- file count: `60`

Confirmed:

- includes `src/html.js`
- includes `src/html.d.ts`
- includes `examples/html-basic/`
- includes `examples/full-flow-basic/`
- excludes `docs/internal/`

### JSR dry-run

Passed.

Confirmed:

- includes `src/html.js`
- includes `src/html.d.ts`
- `jsr.json` exports include `./html`

### Root exports

Root exports remain unpolluted. `page(...)` and `layout(...)` are subpath-only through `@potentiajs/core/html`.

## Public API

Subpath:

```txt
@potentiajs/core/html
```

New exports:

- `page`
- `layout`

Existing exports preserved:

- `html`
- `raw`
- `escapeHtml`
- `attrs`
- `fragment`
- `htmlResponse`

Root exports:

- no HTML helpers root-exported

## Remaining blockers

None.

## Recommendation

Commit and run the publish workflow for `0.2.0-preview.1`.
