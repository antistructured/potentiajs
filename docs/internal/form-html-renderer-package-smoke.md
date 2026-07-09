# Form HTML Renderer Package Smoke

## Files inspected

- `package.json`
- `src/forms.js`
- `src/forms.d.ts`
- packed local artifact
- installed temp-project renderer output

## Files changed

- `docs/internal/form-html-renderer-package-smoke.md`

## Pack result

Local package pack succeeded.

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 61
```

Pack dry-run verified:

- `src/forms.js` included
- `src/forms.d.ts` included
- `examples/form-rendering-basic/` included
- `docs/internal/` excluded

## Installed import result

A fresh temp project installed the local tarball and imported:

```js
import { action, projectForm, createFormState } from '@potentiajs/core';
import { renderForm } from '@potentiajs/core/forms';
```

The installed forms subpath import succeeded.

## Rendered smoke output summary

The installed artifact smoke created a SigilJS action input contract, projected it with `projectForm(...)`, created failed form state with values/errors, and rendered HTML with `renderForm(...)`.

Verified output:

- contains `<form`
- contains escaped action
- contains field label
- contains field error
- contains escaped state value
- does not contain sensitive password value
- does not expose raw HTML from action/error/submit label

Smoke checks:

```json
{
  "hasForm": true,
  "escapedAction": true,
  "hasLabel": true,
  "hasError": true,
  "sensitiveOmitted": true,
  "rawHtmlHidden": true,
  "hasEscapedValue": true
}
```

Output preview:

```html
<form method="POST" action="/users?next=&lt;raw&gt;" enctype="application/x-www-form-urlencoded" data-potentia-form="users.create">
  <div data-potentia-field="email">
    <label for="users-create-email">Email</label>
    <input id="users-create-email" name="email" type="email" required autocomplete="email" value="&lt;ada@example.test&gt;">
    <div data-potentia-errors-for="email">
      <p>Email &lt;must&gt; be valid</p>
    </div>
  </div>
```

## Cleanup status

Temp package and smoke project directories were removed.

## Blockers

None.

## Publish status

No publish command was run.
