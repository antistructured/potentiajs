# Form HTML Renderer State / Error Integration Decision

## Files inspected

- `src/kernel/form-state.js`
- `src/kernel/form-projection.js`
- `examples/form-state-basic/index.js`
- `tests/kernel-form-state-helper.test.js`
- `tests/kernel-form-state-errors.test.js`
- `docs/internal/form-html-renderer-field-rendering-decision.md`

## Decision

The renderer should accept optional form state:

```js
renderForm(formProjection, {
  action: '/users',
  state: formState
});
```

The state is expected to be output from `createFormState(...)`, but invalid/missing state should be treated as empty state.

## Value source policy

Value source order:

1. `state.values[field]` when available and field is not sensitive
2. `field.defaultValue` when state has no value and field is not sensitive
3. empty value

Rules:

- never read raw request bodies
- never mutate state
- never render values for `field.sensitive === true`
- ignore `state.value` in first renderer
- do not render a success banner by default for `state.ok === true`

## Error source policy

Field errors come from:

```js
state.errors[field]
```

Root form errors come from:

```js
state.errors[formProjection.errors.rootKey || '_form']
```

Error arrays are preserved. Multiple errors per field render in order.

## Root error rendering

Recommended root error markup:

```html
<div data-potentia-form-errors>
  <p>...</p>
</div>
```

Render this near the top of the form after the opening `<form>` tag when root errors exist.

## Field error rendering

Recommended field error markup:

```html
<div data-potentia-errors-for="email">
  <p>...</p>
</div>
```

Render after the control inside the field wrapper when field errors exist.

Error messages must be escaped.

## Invalid state behavior

If `options.state` is missing, null, non-object, or not `kind: 'form'`:

```txt
treat as empty state
```

Do not throw by default.

Rationale:

- renderer should be convenient in initial GET renders
- invalid state should not make form rendering fragile
- implementation can still expose diagnostics later if needed

## Successful state

Do not render success messages by default.

Reasons:

- successful POST usually redirects with explicit `303`
- success banners are app-specific copy/layout
- `state.value` may contain data not intended for HTML display

## Deferred

- success banners
- rendering `state.value`
- raw issue/debug output
- custom error renderers
- ARIA policy details beyond minimal safe attributes
- session/flash integration
- redirect-with-errors helper

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
