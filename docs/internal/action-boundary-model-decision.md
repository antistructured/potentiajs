# Action Boundary Model Decision

## Files inspected

- `docs/internal/forms-actions-scope-lock.md`
- `src/kernel/app.js`
- `src/kernel/effect.js`
- `src/kernel/result.js`
- `src/kernel/response.js`
- `src/kernel/route.js`
- `src/kernel/route-manifest.js`

## Decision summary

A future `action(id, handler, options)` primitive should exist.

Actions should be callable route handlers. They should not create hidden RPC transport, hidden route registration, or a separate request pipeline.

Recommended future shape:

```js
action('users.create', effect(function* createUser(ctx) {
  const user = yield call(insertUser, ctx.input);
  return ok(user);
}), {
  input: CreateUserInput,
  output: CreateUserOutput,
  meta: { description: 'Create user' },
  source: { file: 'routes/users.js' }
});
```

Route delivery should be explicit:

```js
route('POST', '/users', createUser)
```

The route should receive the action object directly as its handler when the action object is callable by the runtime. If implementation constraints make direct descriptor execution awkward, `route('POST', '/users', createUser.handler)` may exist as an escape hatch, but it should not be the preferred model.

## Action identity

Actions should require a deterministic explicit action ID:

```txt
users.create
```

Rationale:

- route IDs describe delivery (`POST /users`)
- action IDs describe intent (`users.create`)
- one action may eventually have multiple delivery modes
- manifests can link actions to route IDs without conflating them

Action names may be aliases/display names later, but initial action ID should be the primary stable identity.

## Contracts

Actions should support:

- `input` contract
- `output` contract

The `input` contract validates `ctx.input` before action execution.

The `output` contract validates the action return value before response normalization.

Contracts should use the existing contract adapter/projection pipeline where possible. Generic contracts remain opaque in projections and must not be executed by projection.

## Metadata

Actions should support optional descriptive metadata:

- `meta`
- `source`

Metadata should mirror route metadata posture: descriptive only, not executed, no source inference.

## Effects

Action handlers should support existing handler forms:

- plain functions
- async functions
- `effect(...)` descriptors

Actions should use existing effect execution. They should not introduce a new workflow engine.

## Result / response model

Action handlers should return existing Potentia results where possible:

- `ok(value)`
- `fail(error)`
- response descriptors
- native `Response` only where the route layer already accepts it

The action layer may use an internal action result envelope for validation/projection, but route delivery should normalize through the existing result/response model to avoid a second incompatible result system.

## Route/action relationship

- Routes deliver actions.
- Actions describe intent and data boundaries.
- Route metadata describes HTTP delivery.
- Action metadata describes application intent.
- Route manifests should eventually link `routeId` to `actionId`.

Actions should not auto-register routes in the initial design. Explicit `route(...)` calls remain the composition source of truth.

## Context

Action execution should receive normal route `ctx` with one addition:

- `ctx.input` for validated action input

No separate action context is needed initially.

## Deferred

- implementation of `action()`
- direct callable action descriptor mechanics
- action-specific route auto-registration
- RPC transport
- client SDKs
- form generation
- action manifest implementation
- multiple delivery modes for one action
- stable action ID namespace rules

## Blockers

- The implementation must preserve current route handler compatibility.
- The action descriptor shape must be detectable by `runEffect(...)` or route delivery without executing projection.
- The output contract boundary needs careful response/body extraction rules.
