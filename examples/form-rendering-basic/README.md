# Form Rendering Basic Example

This example demonstrates the experimental optional server-side HTML renderer.

It combines:

- `action(...)`
- `projectForm(...)`
- `createFormState(...)`
- `renderForm(...)` from `@potentiajs/core/forms`

The renderer returns a plain HTML string. It is escaped by default and does not add a frontend runtime, JSX, hydration, client SDK, OpenAPI generator, session/flash helper, or multipart/file handling.

## What it shows

- projecting an action input contract into form metadata
- rendering projected fields as plain HTML
- rendering explicit textarea, hidden, and select fields
- preserving safe state values
- omitting sensitive password values
- rendering field errors
- using `data-potentia-*` styling/testing hooks
- adding baseline accessibility attributes such as `aria-describedby` and `aria-invalid`
- escaping output by default

Textarea and hidden inputs require explicit projection metadata (`field.input === 'textarea'` or `field.input === 'hidden'`, with object `field.input.type` tolerated). Options render as `<select>` from string options or `{ value, label }` objects. The renderer does not add classNames, raw HTML, JSX, a frontend runtime, or hydration.

## Run locally

```bash
bun examples/form-rendering-basic/index.js
```

## Package import

When installed from the package, import the renderer from the forms subpath:

```js
import { action, createFormState, projectForm } from '@potentiajs/core';
import { renderForm } from '@potentiajs/core/forms';
```

`renderForm` is intentionally not exported from the package root.
