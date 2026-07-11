# 0.2.0-preview.0 HTML Foundation Implementation Report

## Outcome

Implemented the first HTML-first response/view foundation for PotentiaJS:

```txt
@potentiajs/core/html
```

Prepared version:

```txt
0.2.0-preview.0
```

No manual publish was run.

## Pass 1 — HTML Implementation Scope Lock

Created:

- `docs/internal/020-preview0-html-implementation-scope-lock.md`

Scope locked to:

- `src/html.js`
- `src/html.d.ts`
- `package.json` / `jsr.json` subpath exports and version
- tests
- `examples/html-basic`
- README
- CHANGELOG
- internal docs

Forbidden work preserved:

- no JSX
- no compiler
- no template file format
- no client runtime
- no hydration
- no virtual DOM
- no SPA router
- no CSS system
- no component model
- no web components abstraction
- no root export pollution

## Pass 2 — Safe HTML Core

Created:

- `src/html.js`
- `docs/internal/020-preview0-safe-html-core.md`

Representation:

- internal `PotentiaHtmlValue` class
- module-local `Symbol('PotentiaHTMLValue')`
- marker is not exported
- values stringify to trusted HTML
- plain strings/objects are not safe HTML
- arrays flatten through child rendering
- `null` / `undefined` render empty

## Pass 3 — Escaping + Raw Trust Boundary

Created:

- `docs/internal/020-preview0-escaping-raw.md`

Exports:

- `escapeHtml(value)`
- `raw(value)`

Behavior:

- escapes `&`, `<`, `>`, `"`, and `'`
- `null` / `undefined` escape to empty string
- primitives stringify then escape
- `raw(...)` is explicit trusted HTML and does not escape

## Pass 4 — Tagged HTML + Fragment

Created:

- `docs/internal/020-preview0-tagged-html-fragment.md`

Exports:

- `html(strings, ...values)`
- `fragment(...children)`

Behavior:

- `html` works as tagged template
- static template strings are trusted author-controlled markup
- interpolated plain values escape
- interpolated safe values preserve HTML
- arrays flatten recursively
- `null` / `undefined` render empty
- normal function call throws `TypeError` in preview.0

## Pass 5 — Attribute Helper

Created:

- `docs/internal/020-preview0-attrs-helper.md`

Export:

- `attrs(attributes)`

Behavior:

- string/number/bigint values escape
- `true` renders boolean attr
- `false` / `null` / `undefined` omit attr
- class arrays work
- `className` maps to `class`
- invalid names reject with `TypeError`
- event handler attrs matching `/^on/i` reject in preview.0
- safe HTML values are still escaped in attribute context

## Pass 6 — HTML Response Helper

Created:

- `docs/internal/020-preview0-html-response.md`

Export:

- `htmlResponse(body, init)`

Behavior:

- returns standard `Response`
- default content type: `text/html; charset=utf-8`
- preserves explicit content-type
- supports `status`, `statusText`, and headers
- safe HTML body renders trusted HTML
- plain string body escapes by default
- arrays/fragments render safely

## Pass 7 — Subpath Exports + Types

Created:

- `src/html.d.ts`
- `docs/internal/020-preview0-subpath-types.md`

Package export:

```json
"./html": {
  "types": "./src/html.d.ts",
  "import": "./src/html.js"
}
```

JSR export:

```json
"./html": "./src/html.js"
```

Root exports:

- unchanged
- no HTML helpers root-exported

## Pass 8 — Tests

Created:

- `tests/html.test.js`
- `docs/internal/020-preview0-html-tests.md`

Focused test run:

```bash
bun test tests/html.test.js
```

Result:

```txt
21 pass
0 fail
42 expect() calls
```

Coverage:

- escaping
- raw trust boundary
- safe value forgery resistance
- tagged `html`
- `fragment`
- `attrs`
- `htmlResponse`
- subpath import
- root export cleanliness
- package/JSR metadata

## Pass 9 — Example + Docs

Created:

- `examples/html-basic/README.md`
- `examples/html-basic/index.js`
- `docs/internal/020-preview0-html-example-docs.md`

Updated:

- `README.md`

Example verification:

```bash
bun run examples/html-basic/index.js
```

Result:

```txt
status: 200
content-type: text/html; charset=utf-8
body includes escaped user text and explicit trusted raw HTML
```

## Pass 10 — Version / Changelog Prep

Created:

- `docs/internal/020-preview0-version-changelog.md`

Updated:

- `package.json`
- `jsr.json`
- `README.md`
- `CHANGELOG.md`

Version:

- previous: `0.1.0`
- current: `0.2.0-preview.0`

## Pass 11 — Full Release Verification

Commands run:

```bash
bun run test
bun run check:release
npm pack --dry-run --json
npx jsr publish --dry-run --allow-dirty
node -e 'const p=require("./package.json"); const j=require("./jsr.json"); if (p.version !== j.version) throw new Error(`${p.version} !== ${j.version}`); console.log(p.version)'
```

Results:

- `bun run test`: pass
- `bun run check:release`: pass
- `npm pack --dry-run --json`: pass
- `npx jsr publish --dry-run --allow-dirty`: pass
- version match check: `0.2.0-preview.0`

Test summary:

```txt
630 pass
0 fail
1529 expect() calls
Ran 630 tests across 86 files.
```

npm pack:

- package: `@potentiajs/core@0.2.0-preview.0`
- file count: `60`
- includes `src/html.js`: yes
- includes `src/html.d.ts`: yes
- includes `examples/html-basic/`: yes
- excludes `docs/internal/`: yes

JSR dry-run:

- success: yes
- includes `src/html.js`: yes
- includes `src/html.d.ts`: yes
- exports include `./html`: yes, via `jsr.json`

Export audit:

- root exports: unchanged 24-export surface
- HTML subpath exports:
  - `attrs`
  - `escapeHtml`
  - `fragment`
  - `html`
  - `htmlResponse`
  - `raw`

## Version

- previous: `0.1.0`
- current: `0.2.0-preview.0`

## Public API

- subpath: `@potentiajs/core/html`
- exports: `html`, `raw`, `escapeHtml`, `attrs`, `fragment`, `htmlResponse`
- root exports: unchanged; no HTML helpers added

## Safety

- escaping: default for interpolated values, fragments, attrs, and plain-string `htmlResponse(...)`
- raw: explicit trusted HTML boundary through `raw(...)`
- attrs: validates names, escapes values, rejects event handler attrs in preview.0
- htmlResponse: standard `Response`, safe default content type, plain strings escaped

## Examples

- added `examples/html-basic`
- example is runnable
- demonstrates no-JSX, no-compiler, server-first HTML response usage

## Remaining blockers

None for preview preparation.

## Recommendation

Commit and run the publish workflow for `0.2.0-preview.0`.
