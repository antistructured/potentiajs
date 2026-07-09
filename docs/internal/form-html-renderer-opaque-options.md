# Form HTML Renderer Opaque / Options Behavior

## Files inspected

- `src/forms.js`
- `src/forms.d.ts`
- `docs/internal/form-html-renderer-customization-opaque-decision.md`

## Files changed

- `src/forms.js`
- `src/forms.d.ts`
- `docs/internal/form-html-renderer-opaque-options.md`

## Public API

Implemented:

```js
export function renderForm(formProjection, options = {}) {}
```

Type declaration:

```ts
export interface RenderFormOptions {
  action?: string;
  method?: string;
  state?: unknown;
  submitLabel?: string;
  idPrefix?: string;
}

export function renderForm(formProjection: unknown, options?: RenderFormOptions): string;
```

## Options

Supported options:

- `action`
- `method`
- `state`
- `submitLabel`
- `idPrefix`

Defaults:

- `action`: `#`
- `method`: projection method or `POST`
- `encType`: projection enctype or URL-encoded
- `submitLabel`: `Submit`
- `idPrefix`: projection id or `potentia-form`

## Opaque / invalid projection behavior

Opaque or invalid projections render a safe form-level message and do not invent fields:

```html
<form method="POST" action="#" enctype="application/x-www-form-urlencoded">
  <div data-potentia-form-error="opaque">This form cannot be rendered from opaque metadata.</div>
</form>
```

Opaque forms do not render a submit button by default.

## Public surface

The forms subpath exports only `renderForm`. Internal helpers remain internal.

## Blockers

None.

## Publish status

No publish command was run.
