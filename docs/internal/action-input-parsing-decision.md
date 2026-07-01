# Action Input Parsing Decision

## Files inspected

- `docs/internal/action-boundary-model-decision.md`
- `src/kernel/app.js`
- `src/kernel/contract.js`
- `src/kernel/context.js`
- `README.md`

## Decision summary

Future action handlers should receive normal route context with validated action input attached as:

```js
ctx.input
```

Do not use `handler(input, ctx)` as the primary model. Keeping `handler(ctx)` preserves current handler/effect conventions and avoids a second invocation signature.

`ctx.body` should remain the existing parsed/validated route body boundary. `ctx.input` is the action-level normalized input boundary.

## Input support order

Recommended implementation order:

1. JSON request body actions
2. `application/x-www-form-urlencoded` form actions
3. explicit route params/query/header composition policy
4. multipart form metadata design
5. file upload support

Implemented sequence now supports JSON and `application/x-www-form-urlencoded` action input. URL-encoded forms enable the first plain HTML form-compatible submission path.

## Parsing by content type

Future action input parser should inspect `Content-Type` and parse supported bodies deterministically.

Initial planned content types:

- `application/json`
- `application/x-www-form-urlencoded`

Deferred content types:

- `multipart/form-data`
- file uploads
- streaming uploads
- mixed JSON + file payloads

Unsupported content types should produce a safe action input failure rather than falling through to handler execution.

## Merge policy

Initial action input should come from body/form fields only.

Do not implicitly merge route params, query, or headers into `ctx.input` in the first implementation.

Rationale:

- implicit merging creates key collision ambiguity
- route params/query/header contracts already exist as separate route boundaries
- forms should not silently trust URL data as body fields
- explicit composition can be added later once the semantics are proven

Future explicit composition could look like:

```js
action('users.update', handler, {
  input: UpdateUserInput,
  include: ['params', 'query', 'body']
});
```

But this is deferred.

## Relationship to existing route contracts

Existing route contracts remain available:

- `params`
- `query`
- `headers`
- `body`
- `response`

Action `input` is an additional action-specific boundary. A future implementation should avoid double-validating the same data by recommending either route `body` or action `input` for a given action route, with action `input` preferred for actions.

## Plain HTML form path

URL-encoded form support normalizes scalar form values into a plain object and validates that object against the action `input` contract.

Repeated fields become arrays of strings. Empty values remain empty strings. No numeric, boolean, date, null, or undefined coercion is performed before contracts run.

Nested objects, arrays, checkboxes, repeated fields, and file values require separate design and should not be guessed in the first implementation.

## Deferred

- multipart parsing
- file upload modeling
- repeated form field policy is settled for the initial implementation: arrays of strings
- nested form object policy
- array field policy
- checkbox coercion policy
- automatic params/query/body merging
- client-side form serialization helpers
- content negotiation helpers

## Blockers

- URL-encoded support needs a clear scalar/repeated-field policy before implementation.
- Multipart support must not be added without file ownership, size limits, temp storage, and streaming decisions.
- Input parsing errors must map to action validation/error shape before implementation.
