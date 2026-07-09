# Form Renderer Accessibility Defaults Decision

## Files inspected

- `src/forms.js`
- `tests/form-html-renderer.test.js`
- `docs/internal/form-renderer-data-attributes-styling-decision.md`

## Decision

Accessibility attributes should be part of the first renderer polish implementation.

This is quality baseline, not extra framework magic.

## Baseline behavior

Recommended defaults:

- labels use `for`
- controls use matching `id`
- help text gets stable IDs
- field errors get stable IDs
- controls with help/errors use `aria-describedby`
- controls with errors use `aria-invalid="true"`
- required fields use native `required`
- form-level errors render in a meaningful container
- errors render as escaped text

Example target shape:

```html
<input
  id="potentia-form-email"
  name="email"
  type="email"
  aria-describedby="potentia-form-email-help potentia-form-email-errors"
  aria-invalid="true"
>
```

Error container:

```html
<div data-potentia-errors-for="email" id="potentia-form-email-errors">
  <p>Email is required.</p>
</div>
```

## ARIA policy

Decision:

```txt
Use minimal ARIA. Prefer native HTML semantics first.
```

Do not over-engineer ARIA roles where native HTML already communicates semantics.

Possible form-level error role can be considered carefully later, but field-level association through `aria-describedby` and `aria-invalid` should be the first polish target.

## ID policy

Help and error IDs should derive from the same stable base as the control ID:

```txt
<control-id>-help
<control-id>-errors
```

Multiple controls for a repeated scalar field should receive deterministic IDs and matching help/error references.

## Deferred

Deferred:

- complex ARIA role strategy
- live regions
- focus management
- client-side announcement behavior
- validation summary navigation
- web component accessibility conventions

## Source/API impact

None.

No implementation, package export, or README feature claim was added.

## Blockers

None.

## Publish status

No publish command was run.
