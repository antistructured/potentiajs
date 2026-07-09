# View Layer Style / Template / Compiler Boundary Decision

## Files inspected

- `README.md`
- `docs/internal/view-layer-html-first-direction-decision.md`
- `docs/internal/view-layer-web-components-progressive-enhancement-decision.md`

## Style direction

Decision:

```txt
regular CSS first
style-friendly HTML attributes
no CSS-in-JS-first direction
style scoping deferred
```

Potentia should generate or encourage markup that is easy to style with normal CSS. Future helpers may add predictable attributes, names, or metadata for styling, but should not require a CSS-in-JS identity.

## Template direction

Decision:

```txt
HTML-first templates if ever designed
no JSX
no VDOM-first architecture
```

Templates, if added, should keep HTML as the primary authoring surface. JavaScript should support contracts/actions/state and dynamic projection, not dominate the syntax.

## Compiler boundary

Decision:

```txt
no compiler now
```

A compiler may be considered later only if it preserves:

- HTML-first authoring
- inspectable output
- server-first rendering
- explicit contracts/actions/state
- progressive enhancement
- no JSX

## Syntax/file extension decision

Decision:

```txt
No syntax or file extension decision yet.
```

Do not choose yet among:

- `.potentia.html`
- `.potentia`
- `.potentia.js`
- `.phtml.js`
- Svelte-like single-file components

Reason:

- premature
- core primitives are still evolving
- current examples should guide future syntax
- form renderer polish should happen before broad template design

## Runtime boundary

No default client runtime should be introduced as part of template/compiler exploration. If future templates need client behavior, it should remain progressive enhancement rather than the app model.

## Deferred

Deferred:

- CSS scoping
- style blocks
- template parser
- compiler
- template syntax
- file extensions
- component runtime
- hydration
- client runtime

## Source/API impact

None.

No implementation, package export, or README feature claim was added.

## Blockers

None.

## Publish status

No publish command was run.
