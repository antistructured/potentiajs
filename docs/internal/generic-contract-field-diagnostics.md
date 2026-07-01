# Generic Contract Field Diagnostics

## Files changed

- `src/kernel/diagnostics.js`
- `src/kernel/contract.js`
- `tests/kernel-generic-contract-field-diagnostics.test.js`
- `docs/internal/generic-contract-field-diagnostics.md`

## Behavior

Generic contract failures now produce canonical opaque root-level issues.

Generic failure issue shape:

```js
{
  code: 'parse_failed' | 'check_failed',
  message: 'Contract rejected value',
  path: [],
  field: null,
  boundary,
  source: 'generic',
  expected: null,
  received: null,
  meta: null
}
```

## Safety

Thrown messages from generic contracts are not exposed. Generic contracts remain opaque because they do not provide safe field metadata.

## Deferred

No custom generic issue protocol was added. Future protocols must sanitize/normalize issue payloads before exposure.

## Tests

`tests/kernel-generic-contract-field-diagnostics.test.js` covers function, parse, check, unsafe thrown messages, invalid contract fallback, canonical shape, and success compatibility.
