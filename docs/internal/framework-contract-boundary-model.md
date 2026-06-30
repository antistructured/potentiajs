# Framework Contract Boundary Model

## Files changed

- `src/kernel/contract.js`
- `src/kernel/route.js`
- `src/kernel/app.js`
- `src/index.js`
- `tests/kernel-contract-boundary.test.js`

## Public surface

No contract adapter helper is exported publicly in this block. Contract behavior is exposed through experimental route options:

```js
route('POST', '/users', handler, {
  body: bodyContract,
  response: responseContract
})
```

## Supported contract shapes

The internal adapter supports SigilJS-compatible and simple contract shapes:

- function contract: `contract(value)`
- parse-style object: `contract.parse(value)`
- check-style object: `contract.check(value)`

SigilJS is not hardcoded and was not added as a dependency.

## Request body behavior

- JSON request body parsing happens only when `options.body` exists.
- The parsed body is validated/transformed before handler execution.
- The validated body is attached to `ctx.body`.
- Failed request body contracts return deterministic 400 JSON:

```js
{ error: { code: 'BAD_REQUEST', message: 'Request body failed contract validation' } }
```

## Response behavior

- `options.response` validates/transforms the response body before native `Response` conversion when the body is extractable.
- Failed response contracts return deterministic 500 JSON:

```js
{ error: { code: 'RESPONSE_CONTRACT_FAILED', message: 'Response failed contract validation' } }
```

## Deferred

- Params contracts.
- Query contracts.
- Header contracts.
- Multiple response contracts by status.
- Contract projection/docs generation.
- Installing or pinning SigilJS.

## Verification

`bun test tests/kernel-contract-boundary.test.js tests/kernel-effect.test.js tests/kernel-router-context.test.js tests/kernel-result-response.test.js` passes with 29 tests.
