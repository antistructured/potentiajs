# View Layer Web Components / Progressive Enhancement Decision

## Files inspected

- `README.md`
- `examples/full-flow-basic/README.md`
- `docs/internal/view-layer-html-first-direction-decision.md`

## Decision

Principle:

```txt
HTML works first. Web components enhance later.
```

Web components are a compatible future enhancement path, but they are not required for basic Potentia apps.

## Web components posture

Web components should:

- enhance regular HTML
- work with server-rendered markup
- compose with contracts/actions/state rather than replace them
- remain optional
- align with web standards
- avoid a framework-specific client runtime requirement

Web components should not become:

- a mandatory rendering layer
- a replacement for server contracts/actions
- a hidden hydration model
- a reason to require a client runtime by default
- a React-like component architecture with different syntax

## Progressive enhancement posture

Potentia's base app should work as server-rendered HTML first.

Enhancement layers may later add behavior where useful, but the server remains authoritative for:

- routing
- actions
- validation
- redirects
- form state
- domain outcomes

## Build web component helpers now?

Decision:

```txt
No. Design only; defer implementation.
```

The current practical path is to continue with form renderer polish after the view philosophy is documented.

## Deferred

Deferred:

- web component helper APIs
- custom element registration helpers
- SSR/custom-element hydration conventions
- event/action binding helpers
- client-side enhancement package

## Source/API impact

None.

No implementation, package export, or README feature claim was added.

## Blockers

None.

## Publish status

No publish command was run.
