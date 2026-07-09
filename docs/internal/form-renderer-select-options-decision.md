# Form Renderer Select / Options Decision

## Files inspected

- `src/forms.js`
- `tests/form-html-renderer.test.js`
- `docs/internal/form-renderer-textarea-multiline-decision.md`

## Decision

Continue rendering `<select>` when finite options exist in projection metadata.

Supported option shapes:

```js
['user', 'admin']
```

and:

```js
[
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' }
]
```

## Rendering behavior

Rules:

- render `<select>` when `field.options` is a non-empty array
- escape option values as attributes
- escape option labels as text
- mark selected option from form state value first
- fall back to field default value when no state value is present
- preserve deterministic option order from projection metadata
- ignore or safely normalize invalid option entries

## Empty option behavior

Decision:

```txt
Do not invent an empty option by default.
Only render options provided by projection metadata.
```

Reason:

A renderer-provided `Select...` option is presentation policy and can change form semantics. Projection metadata should explicitly include an empty option if the application wants one.

Potential future metadata:

```js
{ value: '', label: 'Select...' }
```

## Multiple select

Decision:

```txt
Defer multi-select polish.
```

The current renderer has basic `multiple` attribute behavior, but the next polish foundation should focus on single-select correctness and safety before stabilizing multi-select ergonomics.

Multi-select future work should consider:

- selected arrays
- repeated URL-encoded values
- keyboard/accessibility behavior
- field-state preservation
- empty selection semantics

## Deferred

Deferred:

- generated empty option
- optgroup support
- disabled options
- multi-select polish
- options sourced from async data
- client-side option loading
- custom select renderers

## Source/API impact

None.

No implementation, package export, or README feature claim was added.

## Blockers

None.

## Publish status

No publish command was run.
