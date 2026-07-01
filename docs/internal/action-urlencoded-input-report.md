# Action URL-Encoded Input Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`

## 2. Current version

- `0.0.1`

## 3. Scope completed

Completed:

- URL-encoded scope lock
- action content-type detection hardening
- URL-encoded action input parser
- action input integration
- URL-encoded contract/error tests
- example smoke update
- README/internal report updates
- route manifest content type metadata update

Not performed:

- multipart/form-data
- file uploads
- form generator
- frontend runtime
- browser helpers
- client SDK
- OpenAPI
- action auto-routing/RPC
- DB/auth
- CLI/compiler
- publish prep
- TypeScript conversion

## 4. Content-type behavior

Supported action input content types:

- `application/json`
- `application/json; charset=utf-8`
- `application/x-www-form-urlencoded`
- `application/x-www-form-urlencoded; charset=utf-8`

Detection is case-insensitive and ignores content type parameters.

Missing content type remains JSON-compatible for valid JSON payloads only. URL-encoded-looking missing content type payloads are rejected through the JSON parse path.

Unsupported non-empty content types return `400` with `POTENTIA_ACTION_INPUT_FAILED`.

Unsupported content type without body results in `ctx.input = null` because no payload is parsed.

## 5. URL-encoded parser behavior

URL-encoded payloads parse into plain objects.

```txt
name=Ada&email=ada%40example.com
```

becomes:

```js
{ name: 'Ada', email: 'ada@example.com' }
```

Values are decoded with URL-encoded form rules: `+` becomes space and percent-encoding is decoded.

## 6. Repeated-field policy

Repeated fields become arrays of strings:

```txt
tag=a&tag=b
```

becomes:

```js
{ tag: ['a', 'b'] }
```

Empty values remain empty strings. Missing fields remain absent. No numeric, boolean, date, null, or undefined coercion occurs before contracts run.

## 7. Prototype pollution defense

Dangerous field names are rejected before handler execution:

- `__proto__`
- `constructor`
- `prototype`

This preserves ergonomic plain object output while preventing prototype pollution.

## 8. Contract behavior

URL-encoded action input reuses the same action input contract path as JSON.

Supported contract styles remain:

- generic function
- `{ parse(value) }`
- `{ check(value) }`
- SigilJS

Contracts own transformation from strings into typed values.

Action output contracts and route response contracts remain unchanged.

## 9. Error behavior

Malformed URL-encoded input returns deterministic `400` with `POTENTIA_ACTION_INPUT_FAILED`.

Unsafe raw form bodies are not exposed. Handler failures remain safe and use `POTENTIA_ACTION_HANDLER_FAILED`.

## 10. Example behavior

`examples/action-basic/` now demonstrates:

- JSON action input
- URL-encoded plain-form-compatible input
- `ctx.input`
- SigilJS input/output contracts
- deterministic validation failure
- a README-only plain HTML form snippet

No form helper or frontend runtime was added.

## 11. Tests added/updated

Added:

- `tests/kernel-action-content-type.test.js`
- `tests/kernel-action-urlencoded-parser.test.js`
- `tests/kernel-action-urlencoded-input.test.js`
- `tests/kernel-action-urlencoded-contracts.test.js`
- `tests/kernel-action-urlencoded-errors.test.js`

Updated:

- `tests/action-basic-example.test.js`
- `tests/kernel-action-projection.test.js`

## 12. Deferred features

- multipart/form-data
- file uploads
- form generator
- client validation/runtime helpers
- browser package
- client SDK
- OpenAPI
- action result/redirect semantics
- richer field-level diagnostics

## 13. Recommendation

Next best block: **Action Result / Redirect Semantics** if forms/actions continue before publish prep.

Keep it narrow: post-action redirect patterns, validation failure response shape, form-friendly errors, and no form generator/client SDK yet.
