# Form Renderer Textarea / Hidden Rendering

## Files inspected

- `src/forms.js`
- `docs/internal/form-renderer-input-type-normalization.md`

## Files changed

- `src/forms.js`
- `docs/internal/form-renderer-textarea-hidden-rendering.md`

## Behavior

Implemented explicit textarea and hidden rendering.

## Textarea

Textarea renders only when explicit metadata asks for it:

```js
field.input === 'textarea'
field.input.type === 'textarea'
```

Rendered shape:

```html
<textarea id="..." name="...">escaped value</textarea>
```

Rules implemented:

- value rendered as escaped text content
- placeholder supported
- required supported
- state/default values supported
- sensitive values omitted
- no rich text
- no raw HTML
- no inference from field name, string length, or submitted value

## Hidden

Hidden renders only when explicit metadata asks for it:

```js
field.input === 'hidden'
field.input.type === 'hidden'
```

Rendered shape:

```html
<input data-potentia-control="token" id="..." name="token" type="hidden" value="escaped">
```

Rules implemented:

- value escaped
- sensitive values omitted
- no label rendered
- no help rendered inline
- no field errors rendered inline by default
- no hidden inference

Server contracts/actions remain authoritative; hidden values are never trusted.

## Blockers

None.

## Publish status

No publish command was run.
