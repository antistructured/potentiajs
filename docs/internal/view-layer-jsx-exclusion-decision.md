# View Layer JSX Exclusion Decision

## Files inspected

- `README.md`
- `examples/form-rendering-basic/README.md`
- `examples/full-flow-basic/README.md`
- `docs/internal/view-layer-philosophy-scope-lock.md`

## Decision

Decision:

```txt
JSX is not part of PotentiaJS's framework direction.
```

This is an architectural decision, not a temporary deferral.

## Rule

JSX should not appear in:

- framework examples
- official view-layer plans
- renderer design as a future target
- component design assumptions
- public API direction

Allowed mention:

- rejected architecture only

## Rationale

Potentia's current center of gravity is:

- explicit routes
- contracts/actions/state
- generated route modules
- server-rendered strings
- metadata projection
- progressive enhancement

JSX would pull the project toward a JavaScript-expression-first and React-like mental model that is not the desired identity.

## Rejected architecture

Rejected:

- JSX-first views
- React-like component trees
- virtual DOM as framework identity
- hydration-first app model
- client runtime as default
- CSS-in-JS-first direction

## Ecosystem pressure

Potentia can ignore ecosystem expectations that every JavaScript framework needs JSX. The intended direction is HTML-first and server-first, even if that means avoiding familiar React-like conventions.

## Practical consequence

Future design blocks should not ask, "How would this look in JSX?"

They should ask:

```txt
How does this preserve HTML-first authoring, contracts/actions/state, server-first rendering, and progressive enhancement?
```

## Source/API impact

None.

No source code, package export, README feature claim, or runtime behavior was changed.

## Blockers

None.

## Publish status

No publish command was run.
