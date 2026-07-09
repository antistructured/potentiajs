# Form HTML Renderer Design Report

## 1. Current form primitives

Potentia already has the server-side form primitives needed before rendering:

- `action(...)`
- JSON action input
- URL-encoded action input
- action input/output contracts
- normalized field diagnostics
- `createFormState(...)`
- `projectForm(...)`
- safe parsed-value preservation
- sensitive field omission
- form metadata projection

`createFormState(...)` returns state with:

```js
{
  ok,
  kind: 'form',
  values,
  errors,
  issues,
  error,
  value,
  meta
}
```

`projectForm(...)` returns renderer-independent metadata with:

```js
{
  kind: 'form',
  id,
  actionId,
  method,
  encType,
  opaque,
  fields,
  reason,
  errors: { rootKey: '_form' },
  values: { preservation: 'safe-parsed-values' },
  validation: { server: 'authoritative', client: 'projection-only' },
  redirect: { afterPost: 'explicit-303-recommended' },
  meta
}
```

Current package exports `createFormState` and `projectForm` from the root. There is no form renderer, no `@potentiajs/core/forms` subpath, no frontend runtime, no JSX, and no client SDK.

## 2. Renderer scope

The renderer should be a tiny optional server-side HTML string renderer.

Core principle:

```txt
Forms are projected from contracts, state is created from server results, and HTML rendering is optional.
```

Renderer requirements:

```txt
small
optional
server-side
string-based
escaped by default
metadata-driven
state-aware
non-magical
```

Renderer non-goals:

- frontend runtime
- client-side hydration
- component system
- JSX layer
- layout generator
- CSS framework integration
- browser validation ownership
- OpenAPI/client SDK
- multipart/file handling
- session/flash storage
- execution of contracts, handlers, validators, transforms, or user code

## 3. Public API shape

Future API:

```js
import { renderForm } from '@potentiajs/core/forms';

const html = renderForm(formProjection, {
  action: '/users',
  state: formState
});
```

First public function:

```txt
renderForm
```

Input:

```txt
formProjection from projectForm(...)
options object
```

Initial options:

```js
{
  action,
  method,
  state,
  submitLabel,
  idPrefix
}
```

## 4. Subpath / root decision

Decision:

```txt
Use @potentiajs/core/forms subpath.
Do not add renderForm to the root export.
```

Rationale:

- keeps root API smaller
- communicates rendering is optional
- leaves room for future renderer-adjacent helpers
- avoids implying forms require HTML rendering

First implementation should add package subpath only when implementing the renderer, not during this design gate.

## 5. Return type

Return type:

```txt
HTML string
```

No Response object, template object, JSX node, virtual DOM, stream, or component wrapper in the first renderer.

## 6. Escaping policy

Escape all dynamic HTML text and attribute values by default.

Escape:

- form action
- method
- enctype
- field name
- field id
- labels
- values
- placeholders
- help text
- error messages
- option labels/values
- submit label

Raw HTML bypass:

```txt
not allowed in first implementation
```

No `unsafeHtml`, raw slots, or raw attribute injection in the first renderer.

## 7. Method / enctype policy

Method source order:

1. `options.method`
2. `formProjection.method`
3. `POST`

Allowed methods:

```txt
GET
POST
```

Recommended unsupported-method behavior:

```txt
fallback to POST and do not throw
```

Enctype source order:

1. `formProjection.encType`
2. `application/x-www-form-urlencoded`

Allowed initial enctype:

```txt
application/x-www-form-urlencoded
```

Multipart is deferred.

## 8. Field rendering policy

Render fields from `formProjection.fields` only.

Initial field-to-control mapping:

```txt
text -> <input type="text">
email -> <input type="email">
url -> <input type="url">
tel -> <input type="tel">
password -> <input type="password">
number -> <input type="number">
checkbox -> <input type="checkbox">
```

If `field.options` exposes finite safe options, render `<select>`.

Recommended wrapper:

```html
<div data-potentia-field="email">
  <label for="form-email">Email</label>
  <input id="form-email" name="email" type="email" required>
  <div data-potentia-errors-for="email">...</div>
</div>
```

Rules:

- label before control
- errors after control
- no class names in first implementation
- no layout markup
- unsupported scalar fields fall back to text input when safe
- unsupported complex fields render a safe field-level message or are skipped with a safe marker

## 9. Sensitive field policy

Sensitive fields may render controls, especially password controls, but must never prefill values.

Rules:

- render password-like fields as `<input type="password">`
- never render `state.values[field]` for sensitive fields
- never render `field.defaultValue` for sensitive fields
- align with `createFormState(...)` sensitive omission policy

## 10. Multiple / options behavior

Multiple scalar fields:

```txt
If state.values[field] is an array, render one input per existing state value.
If no state array exists, render one empty input.
```

No add/remove controls in first renderer.

Options:

- if `field.options` exists and is finite/safe, render `<select>`
- escape option labels/values
- select matching state/default value

Deferred:

- radio groups
- repeaters
- arrays of objects
- custom widgets

## 11. State integration

Renderer accepts optional state:

```js
renderForm(formProjection, {
  action: '/users',
  state: formState
});
```

Value source order:

1. `state.values[field]` when available and field is not sensitive
2. `field.defaultValue` when no state value exists and field is not sensitive
3. empty value

State rules:

- missing/invalid state is treated as empty state
- do not mutate state
- do not read raw request body
- ignore `state.value` in first renderer
- no success banner by default

## 12. Error rendering

Root errors from:

```js
state.errors[formProjection.errors.rootKey || '_form']
```

Recommended root error markup:

```html
<div data-potentia-form-errors>
  <p>...</p>
</div>
```

Field errors from:

```js
state.errors[field]
```

Recommended field error markup:

```html
<div data-potentia-errors-for="email">
  <p>...</p>
</div>
```

Multiple errors per field/root render in order. Error messages are escaped.

## 13. Opaque form behavior

If `formProjection.opaque === true`, do not invent fields and do not throw by default.

Recommended output:

```html
<form method="POST" action="/target">
  <div data-potentia-form-error="opaque">This form cannot be rendered from opaque metadata.</div>
</form>
```

Rules:

- render a safe form shell when action/method can be resolved
- render a safe form-level opaque message
- do not execute generic contracts to discover fields
- do not expose raw internal reason text by default

## 14. Customization options

Initial options:

```js
{
  action,
  method,
  state,
  submitLabel,
  idPrefix
}
```

Defaults:

- `action`: required unless future projection carries action URL metadata
- `method`: projection method or `POST`
- `state`: empty state
- `submitLabel`: `Submit`
- `idPrefix`: `formProjection.id || 'potentia-form'`

## 15. Deferred features

Deferred from first implementation:

- source implementation during this design gate
- root export
- public `renderField`
- public `escapeHtml`
- classNames
- custom renderers
- themes
- layout slots
- raw attributes
- raw HTML
- JSX/component API
- frontend runtime
- hydration
- client SDK
- OpenAPI
- multipart/files
- session/flash
- success banners
- rendering `state.value`
- ARIA policy expansion
- radio groups
- textareas without explicit metadata
- arrays of objects/repeaters
- route manifest form rendering
- release/publish fixes

## 16. First implementation plan

Recommended next implementation block: **Form HTML Renderer Foundation**.

Suggested passes:

1. Add `@potentiajs/core/forms` subpath and package files.
2. Implement internal `escapeHtml(...)`.
3. Implement `renderForm(formProjection, options)` returning string.
4. Render safe form shell with method/action/enctype.
5. Render projected scalar fields and select options.
6. Integrate optional `createFormState(...)` values/errors.
7. Apply sensitive value omission.
8. Render opaque fallback message.
9. Add tests for escaping, fields, values, errors, sensitive fields, opaque fallback, and export boundaries.
10. Add a small example; update public docs after tests pass.
11. Verify with `bun run test`, `bun run check:release`, and `npm pack --dry-run --json`.

## 17. Recommendation

Recommendation:

```txt
A — Implement Minimal Form HTML Renderer
```

Reason:

The current primitives are enough for a tiny optional server-side renderer. The design keeps rendering string-based, escaped, state-aware, and separate from the root API while avoiding frontend/runtime/framework commitments.

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
