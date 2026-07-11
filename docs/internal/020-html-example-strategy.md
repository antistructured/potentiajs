# 0.2.0 HTML Example Strategy

## Existing examples

Current public examples:

- `examples/file-routing-basic`
- `examples/form-rendering-basic`
- `examples/full-flow-basic`

Current roles:

### `examples/file-routing-basic`

Purpose:

- demonstrates route tree generation
- demonstrates generated routes with `createApp(...)`
- should remain focused on file-routing

Decision:

- leave unchanged for `0.2.0-preview.0`
- optional later docs note can mention routes may return `htmlResponse(...)`

### `examples/form-rendering-basic`

Purpose:

- demonstrates `projectForm(...)`, `createFormState(...)`, and `renderForm(...)`
- should remain focused on forms renderer

Decision:

- leave unchanged for `0.2.0-preview.0`
- consider adding a short interop variant in `preview.1` if page/layout helpers stabilize

### `examples/full-flow-basic`

Purpose:

- demonstrates file routes, app, action/form metadata, URL-encoded POST, validation failure, form state, form rendering, and redirect success

Decision:

- do not update during `preview.0` foundation
- update after API stabilizes, likely `0.2.0-preview.1`
- goal is to wrap existing flow in `page(...)` / `layout(...)` once those helpers exist

## New examples

### `examples/html-basic`

Decision: add during `0.2.0-preview.0` implementation.

Purpose:

- demonstrate `@potentiajs/core/html` in a minimal, focused app
- avoid forms/actions/file-routing complexity in the first example
- show escaping and `raw(...)` trust boundary clearly

Recommended contents:

```txt
examples/html-basic/
  README.md
  app.js
```

Recommended coverage:

- import from `@potentiajs/core`
- import from `@potentiajs/core/html`
- route returning `htmlResponse(html`...`)`
- escaped user-supplied value
- `attrs(...)` usage
- `fragment(...)` usage
- explicit `raw(...)` with warning/comment
- no JSX
- no compiler
- no client runtime

### Optional route/file-routing variant

Decision: defer unless trivial after foundation.

Rationale:

- `html-basic` should stay small.
- file-routing already has its own example.
- A future `examples/html-file-routing-basic` may be useful but is not required for `preview.0`.

## Deferred examples

### Update `examples/full-flow-basic`

Target: `0.2.0-preview.1`.

Potential changes:

- wrap rendered forms in `page(...)`
- use `layout(...)` for shared shell
- demonstrate progressive enhancement with regular HTML forms
- preserve existing action/form behavior

### Update README quickstart

Target: `preview.0` for basic HTML helper mention, `preview.1/final` for richer app flow.

Rules:

- keep ZeroVer caveat
- keep no-JSX law
- avoid overclaiming production readiness

### Docs/tutorial expansion

Target: final polish.

Potential docs:

- `docs/internal` audit stays internal
- public README section for HTML helpers
- maybe a public `docs/html.md` if the project starts shipping public docs later

## Blockers

None.
