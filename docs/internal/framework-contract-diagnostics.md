# Framework Contract Diagnostics

## Files changed

- `src/kernel/contract.js`
- `src/kernel/app.js`
- `src/kernel/response.js`
- `tests/kernel-contract-diagnostics.test.js`
- Existing contract failure tests updated for diagnostics.

## Public error body

Contract failures now include safe boundary diagnostics:

```js
{
  error: {
    code: 'POTENTIA_CONTRACT_FAILED',
    message: 'Query failed contract validation',
    boundary: 'query',
    issues: [{ message: 'Contract validation failed' }]
  }
}
```

Response contract failures use:

```js
{
  error: {
    code: 'POTENTIA_RESPONSE_CONTRACT_FAILED',
    message: 'Response failed contract validation',
    boundary: 'response',
    issues: [{ message: 'Contract validation failed' }]
  }
}
```

## Boundaries

Diagnostics support:

- `params`
- `query`
- `headers`
- `body`
- `response`

## Safety posture

- Raw input is not exposed.
- SigilJS internal messages are not exposed by default.
- Generic thrown error messages are not exposed by default.
- Issue lists are deterministic and intentionally conservative.

## Verification

Full verification passed:

```bash
bun test
```

Result:

- 113 pass
- 0 fail
- 245 expect() calls

## Deferred

- Field-level issue projection from SigilJS internals.
- Source-map style diagnostics.
- Developer-mode verbose diagnostics.
