# Framework Error Model

## Files changed

- `src/kernel/error.js`
- `src/kernel/result.js`
- `src/kernel/response.js`
- `src/kernel/app.js`
- `src/kernel/contract.js`
- `src/kernel/route.js`
- `src/index.js`
- `tests/kernel-framework-errors.test.js`
- Updated existing tests to typed error codes.

## Experimental exports

- `createFrameworkError(code, message, options)`
- `normalizeFrameworkError(error)`

## Error shape

Framework errors use a stable plain-object shape:

```js
{
  name: 'PotentiaError',
  code,
  message,
  status,
  detail,
  cause,
  expose
}
```

## Error codes

- `POTENTIA_NOT_FOUND`
- `POTENTIA_METHOD_NOT_ALLOWED`
- `POTENTIA_CONTRACT_FAILED`
- `POTENTIA_RESPONSE_CONTRACT_FAILED`
- `POTENTIA_HANDLER_FAILED`
- `POTENTIA_BAD_REQUEST`

## Public response body

Error responses remain deterministic:

```js
{ error: { code, message } }
```

Unsafe/internal errors normalize to:

```js
{ error: { code: 'POTENTIA_HANDLER_FAILED', message: 'Internal server error' } }
```

Exposed framework errors may show their message.

## Integration points

- 404 uses `POTENTIA_NOT_FOUND`.
- 405 uses `POTENTIA_METHOD_NOT_ALLOWED`.
- Body/query/header contract failures use `POTENTIA_CONTRACT_FAILED`.
- Response contract failures use `POTENTIA_RESPONSE_CONTRACT_FAILED`.
- Handler/effect thrown errors use `POTENTIA_HANDLER_FAILED` unless explicitly exposed.
- Invalid route parameter encoding uses `POTENTIA_BAD_REQUEST`.

## Verification

`bun test` passes with 53 tests.
