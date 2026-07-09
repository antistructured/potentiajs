# Form Renderer Input Type Normalization

## Files inspected

- `src/forms.js`
- `docs/internal/form-renderer-field-options-foundation-scope-lock.md`

## Files changed

- `src/forms.js`
- `docs/internal/form-renderer-input-type-normalization.md`

## Behavior

Added internal input-type normalization for renderer field metadata.

The renderer now accepts both string and object shapes:

```js
field.input === 'textarea'
field.input === 'hidden'
field.input === 'text'
```

and:

```js
field.input.type === 'textarea'
field.input.type === 'hidden'
field.input.type === 'text'
```

Known input types:

- `text`
- `email`
- `url`
- `tel`
- `password`
- `number`
- `checkbox`
- `textarea`
- `hidden`

Unknown input types fall back safely to `text`.

## API posture

The normalization helper is internal only.

No public API, package export, root export, or subpath export was added.

## Blockers

None.

## Publish status

No publish command was run.
