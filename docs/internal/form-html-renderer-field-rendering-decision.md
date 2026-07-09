# Form HTML Renderer Field Rendering Decision

## Files inspected

- `src/kernel/form-projection.js`
- `examples/form-state-basic/README.md`
- `tests/kernel-project-form.test.js`
- `docs/internal/form-html-renderer-escaping-policy-decision.md`

## Decision

Render fields from existing `projectForm(...)` metadata only. Do not execute contracts, handlers, validators, transforms, or arbitrary user code.

## Field-to-control mapping

Initial mapping:

```txt
text -> <input type="text">
email -> <input type="email">
url -> <input type="url">
tel -> <input type="tel">
password -> <input type="password">
number -> <input type="number">
checkbox -> <input type="checkbox">
```

If `field.options` is a finite array, render `<select>` before falling back to input mapping.

Textarea inference remains deferred unless future metadata explicitly marks multiline.

## Wrapper structure

Recommended field wrapper:

```html
<div data-potentia-field="email">
  <label for="form-email">Email</label>
  <input id="form-email" name="email" type="email" required>
  <div data-potentia-errors-for="email">...</div>
</div>
```

Rules:

- wrapper carries `data-potentia-field` with escaped field key
- label appears before control
- errors appear after control
- no class names in first implementation
- no layout/grid markup

## ID and name derivation

- `name` comes from `field.name` or `field.field`
- `id` is `${idPrefix}-${safeFieldId}`
- `safeFieldId` should derive deterministically from field name/path by replacing unsafe characters with `-`
- rendered `name` remains the field key, escaped as an attribute value

## Required attribute

Render `required` only when `field.required === true`.

Do not infer required from errors/state.

## Sensitive field policy

Sensitive fields may render controls, including password controls.

Rules:

- render password-like fields as `<input type="password">`
- never prefill values for `field.sensitive === true`
- never render sensitive `defaultValue`
- never render sensitive `state.values[field]`

This aligns with `createFormState(...)` sensitive value omission.

## Multiple scalar field behavior

Recommended first behavior:

```txt
If field.multiple is true and state.values[field] is an array, render one input per existing state value.
If no state array exists, render one empty input.
```

Do not add controls for adding/removing rows. Repeaters are deferred.

## Options behavior

If `field.options` exists and contains finite safe option metadata:

- render `<select name="...">`
- render `<option value="...">Label</option>`
- escape option values and labels
- select the option matching state/default value

Radio groups are deferred.

## Unsupported fields behavior

If a field input type is unsupported:

- render a text input if the field is scalar and not opaque
- otherwise render a safe field-level message and skip inventing complex controls

Do not throw by default for unsupported fields.

## Deferred

- radio groups
- textarea inference
- arrays of objects
- repeaters
- custom widgets
- file inputs/multipart
- hidden fields
- custom field renderers
- CSS framework classes
- client-side validation behavior beyond basic type/required attributes

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
