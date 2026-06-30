# Framework Result / Response Model

## Files changed

- `src/kernel/result.js`
- `src/kernel/response.js`
- `src/index.js`
- `tests/kernel-result-response.test.js`

## Experimental exports

- `ok(value, meta)`
- `fail(error, meta)`
- `json(value, init)`
- `text(value, init)`
- `redirect(location, status)`
- `toResponse(value)`

## Result shapes

Success:

```js
{ ok: true, value, error: null, meta }
```

Failure:

```js
{ ok: false, value: null, error, meta }
```

Keys are initialized in a stable order: `ok`, `value`, `error`, `meta`.

## Response descriptors

Response helpers return descriptors before native conversion. Native `Response` objects are produced through `toResponse(...)`.

Supported descriptors:

- JSON response
- text response
- redirect response

## Error normalization

Errors normalize into safe public JSON bodies:

```js
{ error: { code, message } }
```

Internal `details` are kept in normalized error objects for framework decisions but are not emitted in public response bodies.

## Verification

`bun test tests/kernel-result-response.test.js` passes with 7 tests.
