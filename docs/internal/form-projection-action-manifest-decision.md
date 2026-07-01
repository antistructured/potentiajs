# Form Projection Action / Manifest Relationship Decision

## Files inspected

- `src/kernel/action-projection.js`
- `src/kernel/route-manifest.js`
- `src/kernel/form-state.js`
- `docs/internal/form-state-manifest-deferral-check.md`
- `docs/internal/form-projection-nested-array-options-decision.md`

## Files changed

- `docs/internal/form-projection-action-manifest-decision.md`

## Decision summary

Future form projection should start from actions, not route handlers or raw routes alone.

Candidate future helper:

```js
projectForm(action, options)
```

This helper would project one action input contract into one renderer-independent form metadata object.

## Action relationship

Action-based projection should include:

- `actionId`
- method when available from route/manifest context
- default method `POST`
- default `encType: 'application/x-www-form-urlencoded'`
- fields derived from action input contract
- form state conventions tied to `createFormState(...)`
- server authoritative validation posture
- explicit redirect recommendation

Do not infer handler behavior. An action can be form-capable even if it does not call `createFormState(...)` internally.

## `createFormState(...)` relationship

`createFormState(...)` is runtime state shaping. Form projection is static metadata shaping.

Future form projection may document compatibility with:

```js
state: {
  helper: 'createFormState',
  issueRootKey: '_form',
  values: 'safe-parsed-values'
}
```

But projection must not infer whether a handler uses the helper.

## Manifest strategy

Manifest changes remain deferred until `projectForm(...)` exists.

Two future strategies are acceptable:

1. top-level `forms` section generated explicitly
2. embedded `form` metadata on action manifest entries

Recommended initial manifest strategy after implementation:

```js
{
  forms: [
    {
      id: 'users.create',
      actionId: 'users.create',
      routeId: 'POST /users',
      method: 'POST',
      encType: 'application/x-www-form-urlencoded',
      fields: [],
      state: {
        helper: 'createFormState',
        issueRootKey: '_form'
      }
    }
  ]
}
```

Top-level `forms` is preferred for generated/projected forms because it avoids expanding every action manifest entry with aspirational form data.

## Runtime vs dev/build metadata

Form projection should be safe to run at runtime or dev/build time because it must not execute user handlers or validators.

A later file writer or CLI/compiler integration can persist projections, but that is not part of this design gate.

## Multiple forms per action

Multiple forms per action are deferred.

Initial projection should assume one default form projection per action input. Future options may support alternate field subsets or layouts.

## Renderer-specific metadata

Renderer-specific metadata is excluded.

No React/Svelte/Solid/Vue/HTML generator details should appear in the core projection shape.

## Deferred

- implementation
- manifest `forms` section
- embedded action `form` metadata
- file writing/loading
- renderer-specific metadata
- multiple forms per action
- client SDK/OpenAPI
- CLI/compiler integration

## Blockers

- A form projection helper does not exist yet.
- Handler-level `createFormState(...)` usage cannot be inferred from static action metadata.
