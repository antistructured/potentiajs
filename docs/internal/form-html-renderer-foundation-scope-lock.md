# Form HTML Renderer Foundation Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/index.js`
- `src/kernel/form-state.js`
- `src/kernel/form-projection.js`
- `examples/form-state-basic/`
- `tests/*form*.test.js`
- `docs/internal/form-html-renderer-design-report.md`
- `docs/internal/form-html-renderer-api-shape-decision.md`
- `docs/internal/form-html-renderer-escaping-policy-decision.md`
- `docs/internal/form-html-renderer-field-rendering-decision.md`
- `docs/internal/form-html-renderer-state-error-decision.md`
- `docs/internal/form-html-renderer-customization-opaque-decision.md`

## Exact API being implemented

This block implements the first optional server-side form renderer:

```js
import { renderForm } from '@potentiajs/core/forms';

const html = renderForm(formProjection, {
  action: '/users',
  state: formState
});
```

`renderForm(...)` returns a plain HTML string.

## Exact subpath being added

Add public package subpath:

```txt
@potentiajs/core/forms
```

The subpath should export only:

```txt
renderForm
```

## Root export policy

Do not add `renderForm` to `@potentiajs/core` root exports.

Existing root exports, including `createFormState(...)` and `projectForm(...)`, remain unchanged.

## Internal helpers

These may exist internally but must not be public exports in this block:

- `renderField`
- `escapeHtml`
- `escapeAttribute`
- `renderAttributes`
- method/enctype normalization helpers
- id normalization helpers

## Renderer scope

The renderer is limited to:

- projected form metadata from `projectForm(...)`
- optional state from `createFormState(...)`
- escaped HTML strings
- minimal field wrappers
- root and field error rendering
- sensitive value omission
- opaque projection fallback

Core law:

```txt
Render projected metadata. Do not invent application behavior.
```

## Deferred features

Deferred from this block:

- root `renderForm` export
- public `renderField`
- public `escapeHtml`
- raw HTML bypass
- classNames/themes/slots
- custom field renderers
- frontend runtime
- JSX/components
- hydration
- client SDK/OpenAPI
- multipart/files
- session/flash
- arrays-of-objects/repeaters
- release/publish fixes
- real publish

## Forbidden frontend/runtime behavior

Do not add:

- browser-side runtime
- client-side validation ownership
- hydration hooks
- component API
- JSX integration
- CSS framework opinions
- session or flash storage
- OpenAPI/client generation

Server validation remains authoritative.

## Blockers

None.

## Publish status

No publish command was run.
