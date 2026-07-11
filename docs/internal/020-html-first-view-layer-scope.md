# 0.2.0 HTML-First View Layer Scope

## Included

### Safe HTML value

Included in `0.2.0-preview.0`.

Purpose:

- represent already-escaped/safe HTML fragments explicitly
- prevent accidental mixing of trusted and untrusted strings
- make composition explicit without JSX or a virtual DOM

### Escaping

Included in `0.2.0-preview.0`.

Rules:

- dynamic text escapes by default
- escaped characters include at least `&`, `<`, `>`, `"`, and `'`
- values are stringified conservatively
- `null` / `undefined` children render as empty output

### Raw trusted HTML

Included, but deliberately dangerous.

Rules:

- named `raw(...)` to communicate trust boundary
- never used implicitly
- documentation must say caller is responsible for safety

### `attrs` helper

Included in `0.2.0-preview.0`.

Rules:

- attribute names are validated/escaped safely
- values are escaped
- boolean attributes render only when true
- `false`, `null`, and `undefined` omit attributes
- arrays/classes may be considered only if they stay plain and deterministic

### `fragment` helper

Included in `0.2.0-preview.0`.

Rules:

- flattens arrays/fragments
- escapes plain strings
- preserves safe HTML values
- renders `null` / `undefined` as empty output

### HTML response helper

Included in `0.2.0-preview.0`.

Rules:

- returns a standard `Response`
- default content type: `text/html; charset=utf-8`
- accepts status/statusText/headers options
- should not require Bun-specific response APIs

### `page` helper

Included in `0.2.0-preview.1`, not `preview.0` unless foundation is trivial.

Purpose:

- provide a basic document shell for common apps
- avoid forcing a component model
- support title/head/body composition in plain JS

### `layout` helper

Included in `0.2.0-preview.1`, not `preview.0` unless foundation is trivial.

Purpose:

- enable server-side layout composition without JSX/compiler/hydration
- keep route handlers clean

### Document shell

Included through `page(...)` in `preview.1`.

Scope:

- `<!doctype html>`
- `<html>` / `<head>` / `<body>`
- title/meta/head children/body children
- no asset pipeline, CSS system, or bundler behavior

### Form renderer integration

Included in `preview.1` as interop, not a rewrite.

Scope:

- allow `renderForm(...)` strings to be wrapped safely with `raw(...)` or a renderer-level safe output if the implementation supports it
- examples should demonstrate form + page composition
- do not change form renderer public API unless a release blocker is discovered

### Example app update

Included as adoption support.

Scope:

- add `examples/html-basic` during foundation
- update `examples/full-flow-basic` only after API shape stabilizes, likely `preview.1`

## Excluded

Explicitly excluded from `0.2.0`:

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
- hidden filesystem runtime scanning
- asset pipeline
- database/resource conventions
- dev server/watch mode as primary work

## Open questions

- Should `html` be a tagged template only, a function only, or support both forms?
- Should the safe HTML value expose a public brand/type or stay opaque?
- Should `raw(...)` accept only strings, or any value coerced to string?
- Should `attrs(...)` support `class` arrays/objects in `preview.0`, or keep only primitive attributes first?
- Should `layout(...)` be a higher-order function or a plain composition helper?
- Should form renderer output become a branded safe HTML value in a later pass?

## Blockers

None for roadmap.

The open questions should be settled during the `0.2.0-preview.0` implementation pass before exporting the subpath.
