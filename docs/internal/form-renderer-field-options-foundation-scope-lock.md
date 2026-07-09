# Form Renderer Field Options Foundation Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/forms.js`
- `src/forms.d.ts`
- `tests/form-html-renderer.test.js`
- `examples/form-rendering-basic/`
- `examples/full-flow-basic/`
- `docs/internal/form-renderer-field-options-polish-design-report.md`
- `docs/internal/form-renderer-textarea-multiline-decision.md`
- `docs/internal/form-renderer-select-options-decision.md`
- `docs/internal/form-renderer-hidden-checkbox-scalar-decision.md`
- `docs/internal/form-renderer-data-attributes-styling-decision.md`
- `docs/internal/form-renderer-accessibility-defaults-decision.md`

## Scope

This block implements only the first form renderer field-options polish foundation.

Exact polish being implemented:

- input type normalization for string and object metadata shapes
- explicit textarea rendering
- explicit hidden input rendering
- refined select/options behavior
- stable `data-potentia-*` attributes
- baseline accessibility attributes
- tests, docs, examples, and packed artifact smoke

## Core law

```txt
Improve contract-native HTML. Do not build a component framework.
```

## No-JSX law

PotentiaJS does not use JSX as a framework direction.

This implementation must not introduce JSX, React-like components, virtual DOM identity, hydration-first behavior, or any frontend framework/runtime requirement.

## No frontend runtime / compiler

This block does not add:

- frontend runtime
- hydration
- compiler
- template parser
- web component helpers
- client-side validation runtime

## No package export changes

This block must preserve:

- package root exports unchanged
- `@potentiajs/core/forms` exports only `renderForm`
- no public `renderField`
- no public `escapeHtml`
- no new subpaths

## Deferred features

Deferred:

- classNames
- themes
- slots
- custom renderers
- raw HTML bypass
- public `renderField`
- public `escapeHtml`
- fieldsets/groups
- arrays-of-objects/repeaters
- multi-select polish
- rich text
- multipart/file inputs
- template/compiler integration
- release/publish fixes

## Patch scope for this pass

Documentation only.

No source implementation occurred in this pass.

## Blockers

None.

## Publish status

No publish command was run.
