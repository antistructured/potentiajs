# Form HTML Renderer API Shape Decision

## Files inspected

- `package.json`
- `src/index.js`
- `src/kernel/form-projection.js`
- `src/kernel/form-state.js`
- `docs/internal/form-html-rendering-design-scope-lock.md`
- `docs/internal/form-projection-foundation-report.md`

## Decision

Future renderer API should be a public subpath export, not a root export.

Recommended future import:

```js
import { renderForm } from '@potentiajs/core/forms';
```

First public function:

```js
const html = renderForm(formProjection, {
  action: '/users',
  state: formState
});
```

Return type:

```txt
HTML string
```

## Root vs subpath

Decision:

```txt
Use @potentiajs/core/forms subpath.
Do not add renderForm to the package root.
```

Rationale:

- keeps the root API focused on kernel primitives
- makes rendering clearly optional
- groups future renderer-adjacent helpers without expanding root surface
- avoids implying that HTML rendering is required for forms/actions

## Future package inclusion

A future implementation should add:

- `exports["./forms"]`
- a small source module such as `src/forms.js` or equivalent
- package `files` entry for the subpath module and declaration file

No package changes occur in this design gate.

## Function shape

Recommended public API:

```js
renderForm(formProjection, options)
```

Initial options:

```js
{
  action,
  method,
  state,
  submitLabel,
  idPrefix
}
```

Option meanings:

- `action`: target URL; required unless projection gains safe action URL metadata later
- `method`: optional override, otherwise projection method
- `state`: optional `createFormState(...)` output
- `submitLabel`: optional button label, default `Submit`
- `idPrefix`: optional field id prefix, default projection id or `potentia-form`

## Helper export decision

First public export:

```txt
renderForm
```

Keep internal for first implementation:

```txt
renderField
escapeHtml
```

Rationale:

- `renderField` can become public after field customization needs are proven
- `escapeHtml` is an implementation detail unless users need it for custom slots later
- fewer public exports reduces stabilization burden

## Deferred

- root export `renderForm`
- public `renderField`
- public `escapeHtml`
- class/theme systems
- custom field renderers
- JSX/component API
- client runtime

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
