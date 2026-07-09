# Form HTML Renderer Field Core

## Files inspected

- `src/forms.js`
- `src/kernel/form-projection.js`
- `docs/internal/form-html-renderer-field-rendering-decision.md`

## Files changed

- `src/forms.js`
- `docs/internal/form-html-renderer-field-core.md`

## Field support

Implemented internal projected field rendering for:

- `text`
- `email`
- `url`
- `tel`
- `password`
- `number`
- `checkbox`

Unsupported/unknown input types fall back to text.

## Supported field metadata

The renderer consumes:

- `label`
- `name`
- `field`
- `required`
- `placeholder`
- `help`
- `defaultValue`
- `multiple`
- `options`
- `sensitive`

## Markup

Fields render with a minimal wrapper:

```html
<div data-potentia-field="email">
  <label for="potentia-form-email">Email</label>
  <input id="potentia-form-email" name="email" type="email" required>
</div>
```

## Options and multiple values

- finite `field.options` render as `<select>`.
- `multiple: true` with array state/default values renders one control per value.
- otherwise one control is rendered.

## Sensitive behavior

Sensitive fields render controls but never render state or default values.

## Blockers

None.

## Publish status

No publish command was run.
