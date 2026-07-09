# Full Flow Example Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `examples/`
- `examples/file-routing-basic/`
- `examples/form-rendering-basic/`
- `examples/form-state-basic/`
- `src/index.js`
- `src/forms.js`
- `src/file-routing.js`
- `tests/*example*.test.js`
- `docs/internal/form-html-renderer-design-report.md`
- `docs/internal/form-html-renderer-tests-docs.md`
- `docs/internal/file-routing-public-docs-example-report.md`
- `docs/internal/file-routing-cli-json-output-design-report.md`

## Current primitives being demonstrated

The full-flow example will demonstrate existing Potentia primitives only:

- route kernel and `createApp(...)`
- file route generation through `generateFileRoutes(...)`
- generated routes consumed by the app
- SigilJS input contracts
- `action(...)` as the server-action descriptor/projection primitive
- URL-encoded form POST handling in the example
- normalized field/root issues via `createFormState(...)`
- `projectForm(...)`
- `renderForm(...)` from `@potentiajs/core/forms`
- explicit success redirect

## Scope

Create a compact example app under:

```txt
examples/full-flow-basic/
```

The example should show:

```txt
file routes
→ generated routes
→ app
→ action/form contract metadata
→ contract validation
→ form projection
→ HTML rendering
→ form state after failure
→ redirect after success
```

## No JSX / no frontend runtime law

This example must not use JSX.

Potentia's preferred view-layer direction remains regular HTML, web components, styles, server-rendered strings, compile/projected templates, and possible Svelte-like single-file ergonomics if designed later.

Out of scope unless explicitly reversed by the owner:

- JSX
- React-like component model
- virtual DOM-first architecture
- hydration-first framework identity

For this block, also out of scope:

- component system
- frontend runtime
- browser hydration
- client-side form runtime

## No new API work

Do not change:

- root exports
- subpath exports
- framework behavior
- form renderer behavior
- file-routing behavior
- action pipeline behavior

If action validation ergonomics are awkward for rendering form responses in the same route, document the ergonomic gap and keep the example on existing APIs.

## No release recovery

This block does not address:

- npm registry visibility
- JSR version visibility
- remote CI/publish failures
- real publish

## Package inclusion question

Because existing public examples ship in the package, the likely package decision is to ship `examples/full-flow-basic/` while keeping generated `.potentia/` output excluded.

The final package decision will be documented after pack dry-run evidence.

## Patch scope

Allowed:

- docs
- examples
- tests
- package allowlist for example inclusion

Forbidden:

- source API changes
- package export changes
- core behavior changes
- dependencies

## Blockers

None.

## Publish status

No publish command was run.
