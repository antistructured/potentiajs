# Contract-Native Forms / Actions Design Gate Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`

## 2. Current version

- `0.0.1`

## 3. Scope completed

Completed design decisions for:

- forms/actions scope lock
- action boundary model
- route/action relationship
- action input parsing strategy
- action validation/error shape
- progressive enhancement/client boundary
- action manifest/projection integration
- future implementation sequence

No runtime implementation was added.

## 4. Action model decision

A future `action(id, handler, options)` primitive should exist.

Actions should be callable route handlers and should support:

- explicit action ID
- `input` contract
- `output` contract
- `meta`
- `source`
- plain/async/effect handlers

Actions should use existing effect execution and result/response normalization. They should not create a hidden RPC transport or auto-register routes initially.

## 5. Route/action relationship

Routes deliver actions explicitly:

```js
route('POST', '/users', createUser)
```

Route IDs describe HTTP delivery, e.g. `POST /users`.

Action IDs describe application intent, e.g. `users.create`.

Route manifests should eventually link action entries to route entries by `routeId`.

## 6. Input parsing decision

Action handlers should receive normal route context with validated input attached as:

```js
ctx.input
```

Initial implementation order should be:

1. JSON request body actions
2. URL-encoded form actions
3. explicit params/query/header composition policy
4. multipart design
5. file uploads

Initial action input should come from body/form fields only. Do not implicitly merge params/query/headers into `ctx.input` at first.

## 7. Validation/error shape decision

Recommended future error codes:

- `POTENTIA_ACTION_INPUT_FAILED`
- `POTENTIA_ACTION_OUTPUT_FAILED`
- `POTENTIA_ACTION_HANDLER_FAILED`

Recommended action envelope for future forms/fetch helpers:

```js
{
  ok: true,
  value,
  error: null,
  issues: [],
  meta: null
}
```

Failure:

```js
{
  ok: false,
  value: null,
  error,
  issues,
  meta: null
}
```

This envelope should not replace existing route `ok()` / `fail()` results.

## 8. Progressive enhancement decision

Actions should eventually support plain HTML form submissions.

Fetch/JavaScript enhancement should be optional.

Client-side validation is projection-only convenience and must never be treated as trusted validation.

No frontend framework dependency should be required.

Server-rendered/static form metadata should come before reactive component systems.

## 9. Manifest/projection integration decision

Future route manifests should add a top-level `actions` section linked to routes by `routeId`.

Action manifest entries should include:

- `kind: 'action'`
- `id`
- `routeId`
- `method`
- `path`
- projected `input`
- projected `output`
- `contentTypes`
- `enhancement`
- `source`
- `meta`

Contract projection should reuse `projectContract(...)` and obey the projection law: no executing handlers, hooks, or contracts.

## 10. Deferred features

- `action()` implementation
- `form()` implementation
- action manifests implementation
- form generation
- frontend runtime/hydration
- client SDK generation
- OpenAPI generation
- multipart parsing
- file upload handling
- database integration
- auth integration
- CLI/compiler integration
- TypeScript conversion
- publish prep

## 11. Required future implementation passes

Recommended next implementation block: **Action Primitive Foundation**.

Suggested passes:

1. Action scope lock
2. Action descriptor shape
3. Route delivery integration
4. JSON input parsing and `ctx.input`
5. Input/output contract validation
6. Action projection metadata
7. Action tests/examples/docs
8. Final verification

URL-encoded forms should follow after JSON action behavior is green.

## 12. Risks

- Adding action descriptors must not break existing route handler/effect compatibility.
- Field-level form errors require richer contract diagnostics than currently available.
- URL-encoded repeated/nested field semantics can become accidental API commitments if rushed.
- Multipart/file support requires storage, streaming, limits, and security decisions.
- Action envelopes must not create a second incompatible result model.
- Manifest versioning needs care once top-level `actions` are implemented.

## 13. Recommendation

Proceed next with **Action Primitive Foundation** if implementation should begin.

Keep the first implementation narrow: `action()`, JSON input, `ctx.input`, input/output contracts, explicit route delivery, action projection, and no form generator yet.
