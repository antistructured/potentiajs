# Form Renderer Data Attributes / Styling Contract Decision

## Files inspected

- `src/forms.js`
- `tests/form-html-renderer.test.js`
- `docs/internal/view-layer-philosophy-report.md`
- `docs/internal/form-renderer-hidden-checkbox-scalar-decision.md`

## Decision

Use `data-potentia-*` attributes as the initial styling and testing contract.

Decision:

```txt
Strengthen data-potentia-* attributes before adding classNames.
```

Reason:

- keeps renderer small
- avoids stabilizing a class API too early
- gives users predictable CSS/testing hooks
- aligns with HTML-first and regular CSS direction
- avoids theme/component-system drift

## Stable attributes to design

Initial stable surface:

```txt
data-potentia-form
data-potentia-form-errors
data-potentia-field
data-potentia-label
data-potentia-control
data-potentia-help
data-potentia-errors-for
data-potentia-submit
```

Potential semantics:

- `data-potentia-form`: form/action identifier
- `data-potentia-field`: canonical field key
- `data-potentia-label`: canonical field key
- `data-potentia-control`: canonical field key or control type
- `data-potentia-help`: canonical field key
- `data-potentia-errors-for`: canonical field key
- `data-potentia-submit`: submit button marker
- `data-potentia-form-errors`: form/root error container marker

## Styling example

Users can style with regular CSS:

```css
[data-potentia-field] {
  display: grid;
  gap: 0.25rem;
}

[data-potentia-errors-for] {
  color: crimson;
}
```

## classNames decision

Decision:

```txt
Defer classNames.
```

Do not add this yet:

```js
renderForm(form, {
  classNames: {
    form: '...',
    field: '...',
    label: '...',
    input: '...',
    errors: '...',
    submit: '...'
  }
});
```

Reason:

- naming must stabilize
- class APIs imply broader customization commitments
- data attributes are enough for the first styling/testing surface

## Deferred

Deferred:

- `classNames` option
- theme presets
- slots
- custom renderers
- style scoping
- CSS generation
- public design-system integration

## Source/API impact

None.

No implementation, package export, or README feature claim was added.

## Blockers

None.

## Publish status

No publish command was run.
