# Form HTML Rendering Design Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/index.js`
- `src/kernel/form-state.js`
- `src/kernel/form-projection.js`
- `examples/form-state-basic/`
- `examples/form-state-basic/README.md`
- `examples/form-state-basic/index.js`
- `tests/*form*.test.js`
- `tests/kernel-project-form.test.js`
- `tests/kernel-form-state-helper.test.js`
- `tests/kernel-form-state-errors.test.js`
- `docs/internal/form-projection-foundation-report.md`
- `docs/internal/form-state-helper-foundation-report.md`
- `docs/internal/form-projection-design-gate-report.md`

## Current form primitives

Potentia already has the server-side form foundation primitives:

- `action(...)`
- JSON action input
- URL-encoded action input
- action input/output contracts
- normalized field diagnostics
- `createFormState(...)`
- `projectForm(...)`
- safe parsed-value preservation
- sensitive field omission
- form metadata projection

Current root exports include `createFormState` and `projectForm`. There is no `@potentiajs/core/forms` subpath and no renderer export.

## Why a renderer is being considered

`projectForm(...)` can already produce renderer-independent metadata, and `createFormState(...)` can preserve safe submitted values and group field/root errors. The missing convenience layer is a tiny server-side renderer that turns the metadata plus optional state into plain HTML strings.

The renderer is being considered to reduce repeated boilerplate for simple progressive-enhancement forms while preserving Potentia's current stance:

```txt
Forms are projected from contracts, state is created from server results, and HTML rendering is optional.
```

## Scope for this block

This block is design-only.

It decides:

- whether an HTML renderer should exist
- public API shape
- root export vs subpath export
- escaping policy
- field rendering policy
- state/error integration
- sensitive field behavior
- opaque form behavior
- customization surface
- deferred features
- implementation recommendation

## Implementation forbidden in this block

Do not add or change:

- source renderer implementation
- package exports
- root exports
- subpath exports
- package files metadata
- README claims that a renderer exists
- examples that import a renderer
- tests for a renderer implementation

## Frontend/runtime behavior out of scope

Do not design this as:

- frontend runtime
- client-side hydration
- component system
- JSX layer
- form generator with layout magic
- CSS framework integration
- browser validation layer
- OpenAPI/client SDK
- session/flash helper
- multipart/file upload helper

Server validation remains authoritative.

## Design law

The future renderer must be:

```txt
small
optional
server-side
string-based
escaped by default
metadata-driven
state-aware
non-magical
```

It must not:

```txt
own submission behavior
perform client-side validation
hydrate in the browser
invent fields for opaque forms
store session/flash data
handle multipart/files yet
add CSS/framework opinions
execute user contracts or handlers
```

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
