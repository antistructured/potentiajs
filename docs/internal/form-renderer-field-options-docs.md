# Form Renderer Field Options Docs / Examples

## Files inspected

- `README.md`
- `examples/form-rendering-basic/README.md`
- `examples/form-rendering-basic/index.js`
- `examples/full-flow-basic/README.md`

## Files changed

- `README.md`
- `examples/form-rendering-basic/README.md`
- `examples/form-rendering-basic/index.js`
- `examples/full-flow-basic/README.md`
- `docs/internal/form-renderer-field-options-docs.md`

## Docs

README now concisely states that `renderForm(...)` supports:

- explicit textarea metadata
- explicit hidden metadata
- finite options as `<select>`
- stable `data-potentia-*` styling/testing hooks
- baseline accessibility attributes

The form-rendering example README now documents:

- textarea requires explicit metadata
- hidden requires explicit metadata
- options render as select
- data attributes are styling/testing hooks
- accessibility defaults
- no classNames yet
- no raw HTML
- no JSX/frontend runtime/hydration

The full-flow README notes that rendered forms include data attributes and baseline accessibility attributes.

## Examples

Updated `examples/form-rendering-basic/index.js` to demonstrate:

- explicit textarea field
- explicit hidden field
- select field with string and `{ value, label }` options
- state value preservation
- escaped textarea content
- hidden field rendering
- field help and field errors
- `aria-describedby` / `aria-invalid` output
- sensitive password omission remains

Example smoke command passed:

```bash
bun examples/form-rendering-basic/index.js
```

Smoke output confirmed:

- `<textarea>` renders
- `type="hidden"` renders
- `<select>` renders
- `data-potentia-control` renders
- `aria-describedby` renders
- `aria-invalid="true"` renders
- dynamic textarea value is escaped

## Unsupported claims avoided

Docs do not claim:

- classNames
- themes
- slots
- custom renderers
- raw HTML
- JSX
- frontend runtime
- hydration
- compiler

## Blockers

None.

## Publish status

No publish command was run.
