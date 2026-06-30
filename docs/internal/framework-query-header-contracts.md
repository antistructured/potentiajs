# Framework Query / Header Contracts

## Files changed

- `src/kernel/context.js`
- `src/kernel/contract.js`
- `src/kernel/app.js`
- `tests/kernel-query-header-contracts.test.js`
- Updated existing router/effect tests for plain query objects.

## Behavior added

Route options now support:

```js
route('GET', '/search', handler, {
  query: queryContract,
  headers: headersContract
})
```

Supported contract styles remain:

- function contract
- `{ parse(value) }`
- `{ check(value) }`

## Query object semantics

`ctx.query` is now a deterministic plain object:

- keys are sorted lexically
- single values are strings
- repeated values become arrays in URL order

Example:

```js
/search?tag=a&tag=b&q=term
// ctx.query === { q: 'term', tag: ['a', 'b'] }
```

## Header object semantics

`ctx.headers` is now a deterministic plain object:

- header names are lowercase
- header entries are sorted lexically during object construction
- values are strings from the native `Headers` object

## Failure behavior

- Failed query contracts return deterministic 400 with message `Query failed contract validation`.
- Failed header contracts return deterministic 400 with message `Headers failed contract validation`.
- Existing body contract behavior remains intact.

Typed framework error codes are introduced in the next pass; this pass preserves the pre-existing `BAD_REQUEST` response shape.

## Verification

`bun test` passes with 45 tests.
