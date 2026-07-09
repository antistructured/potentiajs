# Form HTML Renderer Tests / Example / Docs

## Files inspected

- `tests/*form*.test.js`
- `README.md`
- `examples/form-state-basic/`
- `src/forms.js`
- `src/forms.d.ts`

## Files changed

- `tests/form-html-renderer.test.js`
- `examples/form-rendering-basic/index.js`
- `examples/form-rendering-basic/README.md`
- `README.md`
- `package.json`
- `docs/internal/form-html-renderer-tests-docs.md`

## Tests

Added `tests/form-html-renderer.test.js` covering:

- forms subpath import works
- root export does not include `renderForm`
- subpath exports only `renderForm`
- simple text/email/password/number/checkbox rendering
- escaped action, labels, values, placeholders, help, submit labels
- state values render
- sensitive values do not render
- root errors render
- field errors render
- multiple errors preserve order
- checkbox checked state
- method, submitLabel, and idPrefix options
- unsupported method/enctype fallback
- select/options rendering
- multiple scalar value rendering
- opaque form fallback
- invalid projection fallback
- no raw HTML bypass

Focused test run:

```txt
10 pass
0 fail
40 expect() calls
```

## Example

Added `examples/form-rendering-basic/` with:

- `README.md`
- `index.js`

The example demonstrates:

- SigilJS action input contract
- `projectForm(action)`
- `createFormState(...)`
- `renderForm(...)`
- produced HTML string
- no frontend runtime

Example smoke command passed:

```bash
bun examples/form-rendering-basic/index.js
```

The output includes projected fields and field errors, while omitting the sensitive password value.

## README

Updated README to document:

- experimental forms subpath import
- server-side HTML string renderer
- escaped by default
- metadata-driven and state-aware behavior
- no root export
- no frontend runtime, JSX, hydration, custom renderer system, client SDK, OpenAPI, session/flash, or multipart/file upload helper
- server validation remains authoritative

## Blockers

None.

## Publish status

No publish command was run.
