# Form Renderer Field Options Polish Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/forms.js`
- `src/forms.d.ts`
- `examples/form-rendering-basic/`
- `examples/full-flow-basic/`
- `tests/form-html-renderer.test.js`
- `docs/internal/form-html-renderer-design-report.md`
- `docs/internal/form-html-renderer-tests-docs.md`
- `docs/internal/view-layer-philosophy-report.md`
- `docs/internal/full-flow-example-docs.md`

## Current renderer behavior

Current public renderer surface:

```txt
@potentiajs/core/forms → renderForm
```

Current root export posture:

```txt
renderForm is not exported from package root.
renderField is not public.
escapeHtml is not public.
```

Current renderer supports:

- `<form>` generation
- labels
- basic inputs: `text`, `email`, `url`, `tel`, `password`, `number`, `checkbox`
- options rendered as `<select>`
- required fields
- placeholders
- help text
- default values
- multiple scalar values as repeated inputs
- state values
- root errors
- field errors
- opaque fallback
- sensitive value omission
- escaped text/attribute output

Current renderer does not include:

- textarea support
- hidden input policy
- stable full data-attribute styling contract
- accessibility polish beyond labels/required
- classNames/themes/slots/custom renderers
- raw HTML bypass

## No-JSX architectural law

Project law from the view-layer philosophy gate:

```txt
PotentiaJS does not use JSX as a framework direction.
```

This renderer polish must not move Potentia toward JSX, React-like components, VDOM-first architecture, hydration-first app identity, or a default client runtime.

## HTML-first direction

Renderer polish should move Potentia toward:

```txt
contract-native HTML
```

The renderer should remain:

- small
- safe
- server-side
- HTML-first
- metadata-driven
- state-aware
- style-friendly
- progressively enhanceable later

## Scope

This block is design-only.

Polish areas being designed:

- textarea/multiline policy
- select/options policy
- hidden field policy
- checkbox policy
- multiple scalar behavior
- `data-potentia-*` styling/testing surface
- classNames deferral
- accessibility defaults
- `renderField` public/private posture
- first implementation recommendation

## Out of scope

Out of scope:

- source implementation
- source tests for new behavior
- package exports
- README feature claims
- JSX
- frontend runtime
- component system
- compiler
- hydration
- web component implementation
- raw HTML bypass
- class/theme system implementation
- release/publish fixes

## Deferred renderer features

Deferred:

- classNames/themes/slots/custom renderers
- public `renderField`
- public `escapeHtml`
- raw HTML extension points
- arrays-of-objects/repeaters
- fieldsets/groups
- rich text
- multipart/file input policy
- client-side validation/runtime
- web component helpers
- template/compiler integration

## Patch scope

Allowed:

- `docs/internal/form-renderer-*.md`

Forbidden:

- `src/`
- `examples/`
- `tests/`
- `package.json`
- `README.md`

## Blockers

None.

## Publish status

No publish command was run.
