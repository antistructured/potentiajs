# Form HTML Renderer Customization / Opaque Behavior Decision

## Files inspected

- `src/kernel/form-projection.js`
- `src/kernel/form-state.js`
- `docs/internal/form-html-renderer-api-shape-decision.md`
- `docs/internal/form-html-renderer-state-error-decision.md`

## Customization decision

Initial renderer options:

```js
{
  action,
  method,
  state,
  submitLabel,
  idPrefix
}
```

## Option behavior

### `action`

Required unless future projection metadata provides a safe action URL.

The action URL is escaped before rendering.

### `method`

Optional override. If omitted, use `formProjection.method`, then `POST` fallback.

Allowed first-renderer methods:

```txt
GET
POST
```

### `state`

Optional `createFormState(...)` output. Missing/invalid state is treated as empty state.

### `submitLabel`

Optional submit button text. Default:

```txt
Submit
```

Escaped before rendering.

### `idPrefix`

Optional field id prefix. Default:

```txt
formProjection.id || potentia-form
```

Sanitize before use in generated ids.

## Deferred customization

Defer from first implementation:

- `classNames`
- custom field renderers
- custom form/field/error slots
- layout slots
- raw attribute injection
- raw HTML
- themes
- CSS framework integration
- custom widget registry
- client validation options

Reason:

Customization expands public API quickly. First renderer should prove a safe baseline before adding extension points.

## Opaque behavior decision

If `formProjection.opaque === true`, the renderer should not invent fields and should not throw by default.

Recommended default output:

```html
<form method="POST" action="/target">
  <div data-potentia-form-error="opaque">This form cannot be rendered from opaque metadata.</div>
</form>
```

Rules:

- render the `<form>` shell if action/method can be resolved
- render a safe form-level opaque message
- do not render fields
- do not execute contracts to discover fields
- do not expose internal reason text unless safely escaped and intentionally included later

## Throwing policy

Do not throw by default for opaque projections.

Potential future option:

```js
{ onOpaque: 'message' | 'empty' | 'throw' }
```

Deferred from first implementation.

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
