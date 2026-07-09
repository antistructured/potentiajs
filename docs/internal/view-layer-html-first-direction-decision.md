# View Layer HTML-First Direction Decision

## Files inspected

- `README.md`
- `src/forms.js`
- `examples/form-rendering-basic/`
- `examples/full-flow-basic/`
- `docs/internal/form-html-renderer-design-report.md`
- `docs/internal/form-html-renderer-tests-docs.md`
- `docs/internal/view-layer-jsx-exclusion-decision.md`

## Decision

Preferred direction:

```txt
HTML-first authoring
server-first rendering
contract-aware projected forms
regular HTML
style-friendly markup
progressive enhancement
Svelte-like ergonomics later if a compiler ever exists
```

Future templates should be HTML-first rather than JavaScript-expression-first.

## Near-term posture

Decision:

```txt
No general view compiler yet.
```

The framework should continue to mature the existing server/action/form primitives before choosing a template syntax or compiler shape.

## Relationship to renderForm(...)

`renderForm(...)` is the first narrow HTML projection helper.

It is not:

- the whole view layer
- a component system
- a template language
- a layout engine
- a client runtime
- a compiler

Its purpose is narrower:

```txt
projected form metadata + optional form state → escaped server-side HTML string
```

That makes it a proof point for the larger direction: Potentia can render useful HTML from contracts/actions/state without JSX or a runtime framework.

## Template direction

If a future template layer is designed, it should preserve HTML as the primary authoring surface.

Possible future shapes remain open:

- HTML-first files
- tagged template helpers
- projected template metadata
- Svelte-like single-file authoring later

But no syntax or file extension is selected in this block.

## Deferred

Deferred:

- template compiler
- template parser
- file extension choice
- component model
- slot/layout syntax
- style scoping
- hydration
- client runtime

## Source/API impact

None.

No implementation, package export, or README feature claim was added.

## Blockers

None.

## Publish status

No publish command was run.
