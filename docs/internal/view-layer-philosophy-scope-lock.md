# View Layer Philosophy Scope Lock

## Files inspected

- `README.md`
- `package.json`
- `src/index.js`
- `src/forms.js`
- `src/file-routing.js`
- `examples/form-rendering-basic/`
- `examples/full-flow-basic/`
- `docs/internal/form-html-renderer-design-report.md`
- `docs/internal/form-html-renderer-tests-docs.md`
- `docs/internal/full-flow-example-docs.md`

## Why this gate exists now

Potentia now has enough server-side HTML capability for view-layer direction to matter:

- `renderForm(...)` exists on `@potentiajs/core/forms`
- form projection and form state exist
- the full-flow example shows generated routes, an app, action/form contract metadata, URL-encoded POST handling, validation/domain failures, server-rendered forms, and success redirects
- file routing and CLI generation/checking exist
- no frontend runtime exists

Before adding renderer polish or any UI helper, the project needs an architectural guardrail for what the view layer is and is not.

## Scope

This block is documentation-only architecture work.

In scope:

- permanent no-JSX law
- HTML-first direction
- relationship between `renderForm(...)` and a future view layer
- web component and progressive enhancement posture
- style/template/compiler boundaries
- next implementation recommendation

## No JSX law

Project law:

```txt
PotentiaJS does not use JSX as a framework direction.
```

JSX may be mentioned only as a rejected architectural option.

## No implementation

This block must not add or modify:

- source implementation
- renderer behavior
- form projection behavior
- file-routing behavior
- route/action behavior
- examples/tests for new runtime features

## No compiler/runtime work

This block does not add:

- template parser
- compiler
- `.potentia.html` / `.phtml.js` implementation
- component runtime
- hydration
- client router
- web component helpers
- CSS scoping implementation

## No package export changes

This block must not change:

- root exports
- `@potentiajs/core/file-routing`
- `@potentiajs/core/forms`
- package dependencies
- package entrypoints

## README posture

Do not add README feature claims for unavailable view-layer features. This gate records internal architecture direction, not public availability.

## Patch scope

Allowed:

- `docs/internal/view-layer-*.md`

Forbidden:

- source code
- package metadata/export changes
- public README feature claims

## Blockers

None.

## Publish status

No publish command was run.
