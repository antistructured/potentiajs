# Form Renderer Textarea / Multiline Decision

## Files inspected

- `src/forms.js`
- `src/forms.d.ts`
- `tests/form-html-renderer.test.js`
- `docs/internal/form-renderer-field-options-polish-scope-lock.md`

## Decision

Support textarea rendering in the next implementation, but only when projection metadata explicitly asks for multiline rendering.

Initial accepted signal:

```js
field.input === 'textarea'
```

Because current field metadata stores `input` as an object in many paths, implementation should also tolerate the existing normalized shape if needed:

```js
field.input.type === 'textarea'
```

The design intent remains explicit metadata only.

## Behavior

Rendered shape:

```html
<textarea id="..." name="...">escaped value</textarea>
```

Rules:

- escape value as text content
- support state values
- support default values
- support `placeholder`
- support `required`
- support field errors using the same field-error path as other controls
- preserve sensitive omission rules if a field is marked sensitive
- no raw HTML inside textarea
- no rich text mode

## Inference policy

Do not infer textarea from:

- string length
- field name such as `description` or `body`
- placeholder text
- submitted value containing newlines

Reason:

Textarea selection is presentation metadata. Inferring it from content risks unstable output and surprising contract projection behavior.

## Future optional signals

Future projection metadata may also support:

```js
field.multiline === true
field.meta.multiline === true
```

These are deferred until the field metadata extension surface is designed.

## Deferred

Deferred:

- automatic inference
- rich text
- markdown editor behavior
- contenteditable
- client-side autosize
- rows/cols policy
- public textarea-specific options

## Source/API impact

None.

No implementation, package export, or README feature claim was added.

## Blockers

None.

## Publish status

No publish command was run.
