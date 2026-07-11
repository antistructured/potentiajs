# 0.2.0-preview.0 Tagged HTML + Fragment

## Files changed

- `src/html.js`
- `docs/internal/020-preview0-tagged-html-fragment.md`

## Exports

Added:

- `html(strings, ...values)`
- `fragment(...children)`

## `html` behavior

`html` is a tagged-template helper in preview.0.

Rules:

- static template strings pass through as author-controlled markup
- interpolated plain values escape by default
- interpolated safe values from `raw(...)`, `html(...)`, or `fragment(...)` render unescaped
- arrays flatten recursively
- `null` / `undefined` render empty

## `fragment` behavior

Rules:

- children flatten recursively
- plain values escape
- safe values preserve trusted HTML
- `null` / `undefined` omitted
- arrays do not comma-join

## Normal-call decision

Decision: `html(...)` throws `TypeError` unless called as a tagged template.

Reason:

- avoids ambiguous trust semantics for `html('<p>literal</p>')`
- keeps preview.0 API focused on one safe authoring shape
- callers can use `raw(...)` only when they intentionally trust literal HTML

## Blockers

None.
