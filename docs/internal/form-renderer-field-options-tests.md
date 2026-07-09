# Form Renderer Field Options Tests

## Files inspected

- `tests/form-html-renderer.test.js`
- `src/forms.js`

## Files changed

- `tests/form-html-renderer.test.js`
- `docs/internal/form-renderer-field-options-tests.md`

## Tests added / updated

Updated `tests/form-html-renderer.test.js` to cover the field-options polish foundation.

Coverage includes:

### Textarea

- explicit string input metadata renders `<textarea>`
- object input metadata renders `<textarea>`
- textarea values are escaped as text content
- textarea does not infer from field name or long string value

### Hidden

- explicit string input metadata renders hidden input
- object input metadata renders hidden input
- hidden values are escaped
- hidden field does not render label/help/errors inline
- sensitive hidden values remain omitted

### Select/options

- string options render
- `{ value, label }` options render
- selected option from state
- selected option from default value
- option labels/values are escaped
- malformed option objects are ignored
- no empty option is invented

### Data attributes

Verified:

- `data-potentia-form`
- `data-potentia-field`
- `data-potentia-label`
- `data-potentia-control`
- `data-potentia-help`
- `data-potentia-errors-for`
- `data-potentia-submit`

### Accessibility

Verified:

- label `for` matches control `id`
- help/errors have stable IDs
- `aria-describedby` references help/errors
- `aria-invalid="true"` renders when field errors exist
- `aria-invalid` is omitted when no field errors exist
- native `required` remains

### Regression

Verified:

- root export unchanged
- forms subpath still exports only `renderForm`
- no raw HTML bypass
- sensitive values still omitted
- unknown input types fall back safely to text

## Focused test run

```txt
15 pass
0 fail
68 expect() calls
```

## Blockers

None.

## Publish status

No publish command was run.
