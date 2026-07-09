# Form Renderer Data Attributes / Accessibility

## Files inspected

- `src/forms.js`
- `docs/internal/form-renderer-select-options-polish.md`

## Files changed

- `src/forms.js`
- `docs/internal/form-renderer-data-attributes-accessibility.md`

## Behavior

Implemented stable `data-potentia-*` attributes and baseline accessibility behavior.

## Data attributes

The renderer now consistently emits:

- `data-potentia-form`
- `data-potentia-form-errors`
- `data-potentia-field`
- `data-potentia-label`
- `data-potentia-control`
- `data-potentia-help`
- `data-potentia-errors-for`
- `data-potentia-submit`

These are the initial styling/testing surface. No `classNames` API was added.

## Accessibility

Implemented:

- label `for`
- matching control `id`
- help text stable IDs
- field error stable IDs
- `aria-describedby` when help/errors exist
- `aria-invalid="true"` when field errors exist
- native `required`
- minimal ARIA; native HTML semantics first

Hidden fields intentionally do not render label/help/errors inline and do not add `aria-describedby`.

Checkboxes preserve label association and existing checked-state semantics.

## Blockers

None.

## Publish status

No publish command was run.
