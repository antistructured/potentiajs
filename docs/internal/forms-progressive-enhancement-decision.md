# Forms Progressive Enhancement Decision

## Files inspected

- `docs/internal/action-boundary-model-decision.md`
- `docs/internal/action-input-parsing-decision.md`
- `docs/internal/action-validation-error-shape-decision.md`
- `README.md`
- `examples/`

## Decision summary

Future Potentia actions should work with plain HTML form submission first, then support optional fetch-based progressive enhancement.

Client-side validation is projection-only convenience. It is never a trust boundary.

No frontend framework should be required.

## Plain HTML forms

Actions should eventually support standard form delivery:

```html
<form method="post" action="/users">
  <input name="name">
  <input name="email">
  <button type="submit">Create user</button>
</form>
```

This requires URL-encoded action input support before any form generator becomes useful.

Plain form support should not require JavaScript, hydration, client routing, or a compiler.

## Progressive enhancement

Fetch/JavaScript enhancement should be optional and layered on top of the same server action boundary.

Enhanced clients may eventually:

- serialize form data
- submit with `fetch`
- render action envelopes
- map validation issues to fields
- run projected client-side preflight validation

But enhanced clients must not change the authoritative server validation path.

## Client validation

Client validation should be generated/projected from the same contracts used on the server, but only as UX assistance.

Client validation must be documented as:

```txt
projection-only, never trusted
```

Server validation remains required for every action submission.

## Framework neutrality

Future form/action helpers should avoid lock-in to:

- React
- Svelte
- Solid
- Vue
- client router frameworks
- hydration runtimes

Any future client package can be optional and layered after the server boundary is stable.

## Server-rendered forms before reactive components

If Potentia grows form rendering, the first target should be server-rendered/static HTML form metadata or examples, not reactive component systems.

Rationale:

- validates contract-native action model first
- preserves framework neutrality
- keeps runtime magic low
- supports progressive enhancement later

## Form primitive stance

Do not add a `form()` runtime primitive in the first action implementation unless implementation evidence proves it is necessary.

Preferred sequence:

1. `action(...)` server boundary
2. action projection/manifest metadata
3. simple documented HTML form usage
4. optional form projection shape
5. future generator/client helper

## Deferred

- `form()` implementation
- form renderer/generator
- reactive component helpers
- client SDKs
- hydration
- client router
- browser package
- field-level client validation runtime
- optimistic UI
- multipart/file UI handling

## Blockers

- Field-level issue mapping needs richer contract diagnostics.
- URL-encoded repeated/nested field policy must be settled before robust generated forms.
- Progressive enhancement needs an action response envelope and content negotiation strategy before implementation.
