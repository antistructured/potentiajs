# Form HTML Renderer State / Errors

## Files inspected

- `src/forms.js`
- `src/kernel/form-state.js`
- `docs/internal/form-html-renderer-state-error-decision.md`

## Files changed

- `src/forms.js`
- `docs/internal/form-html-renderer-state-errors.md`

## Behavior

`renderForm(formProjection, { state })` now consumes optional `createFormState(...)` output.

Implemented behavior:

- valid form state values render into matching fields
- invalid/missing state is treated as empty state
- state is not mutated
- root errors render from `state.errors._form`
- field errors render from `state.errors[field]`
- multiple errors preserve order
- error messages are escaped
- `state.value` is ignored
- no success banner is rendered

## Error markup

Root errors:

```html
<div data-potentia-form-errors>
  <p>...</p>
</div>
```

Field errors:

```html
<div data-potentia-errors-for="email">
  <p>...</p>
</div>
```

## Sensitive state values

Sensitive values are never rendered, even if present in state.

## Blockers

None.

## Publish status

No publish command was run.
