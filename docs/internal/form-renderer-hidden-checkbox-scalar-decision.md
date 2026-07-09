# Form Renderer Hidden / Checkbox / Scalar Field Decision

## Files inspected

- `src/forms.js`
- `tests/form-html-renderer.test.js`
- `docs/internal/form-renderer-select-options-decision.md`

## Hidden field decision

Support hidden inputs only when projection metadata explicitly marks the field as hidden.

Initial signal:

```js
field.input === 'hidden'
```

Implementation may also tolerate the normalized current shape:

```js
field.input.type === 'hidden'
```

Rules:

- render `<input type="hidden">` only for explicit hidden metadata
- escape the value as an attribute
- preserve state/default value behavior
- do not infer hidden fields from names or metadata absence
- do not render label/help/errors inline by default for hidden fields
- hidden input values are never trusted; server contracts/actions remain authoritative

## Hidden field trust policy

Documentation should make clear:

```txt
Hidden values are submitted by the browser but are not trusted by Potentia.
They must still pass server-side contracts and domain checks.
```

## Checkbox decision

Checkbox behavior should remain simple and explicit.

Default shape:

```html
<input type="checkbox" name="active" value="true">
```

Checked shape:

```html
<input type="checkbox" name="active" value="true" checked>
```

Checked state should come from state/default truthiness using the existing conservative truthy values:

- `true`
- `'true'`
- `'on'`
- `'1'`
- `1`

Unchecked checkboxes submit no value in browser form behavior. Server-side validation remains authoritative.

## Multiple scalar decision

Current behavior renders one input per value for multiple scalar values.

Decision:

```txt
Keep this behavior for now.
```

This is adequate for simple repeated scalar fields and avoids designing repeaters prematurely.

## Deferred

Deferred:

- arrays-of-objects/repeaters
- fieldset/group rendering
- checkbox groups
- radio groups
- unchecked hidden companion fields
- hidden field signing/encryption
- multipart/file inputs

## Source/API impact

None.

No implementation, package export, or README feature claim was added.

## Blockers

None.

## Publish status

No publish command was run.
