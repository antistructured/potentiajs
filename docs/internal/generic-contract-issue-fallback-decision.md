# Generic Contract Issue Fallback Decision

## Files inspected

- `src/kernel/contract.js`
- `src/kernel/error.js`
- `tests/kernel-contract-diagnostic-dx.test.js`
- `tests/kernel-action-validation-shape.test.js`
- `docs/internal/field-diagnostics-issue-shape-decision.md`

## Files changed

- `docs/internal/generic-contract-issue-fallback-decision.md`

## Generic contract kinds

Potentia currently adapts opaque generic contracts from:

- function contracts
- `{ parse(value) }`
- `{ check(value) }`
- unknown/custom shapes

Only `{ check(value) }` currently has a special internal false-check code before safe public normalization.

## Decision

Generic contracts remain opaque by default.

If a generic contract fails, the future canonical fallback issue should be root-level:

```js
{
  code: 'contract_failed',
  message: 'Contract rejected value',
  path: [],
  field: null,
  boundary: boundary,
  source: 'generic',
  expected: null,
  received: null,
  meta: null
}
```

For `{ check(value) }` returning false, Potentia may use:

```js
code: 'contract_failed'
message: 'Contract rejected value'
```

or a more specific internal mapping such as `check_failed`, but the public message should remain safe and generic.

## Thrown errors

Thrown error messages from generic contracts must not be exposed by default.

Reasons:

- generic validators are user code
- thrown messages may contain raw input, secrets, SQL fragments, stack context, or implementation details
- a function contract cannot prove which field failed

Current safe messages such as `Contract parser rejected value` demonstrate the correct safety posture.

## Optional future issue protocol

A future explicit custom issue protocol may be designed, but is deferred from this design gate.

Possible future protocols:

- thrown error with `issues` array
- contract method `issues(value, context)`
- parse/check returning `{ ok: false, issues }`

Any custom protocol must:

- validate issues against the canonical shape
- sanitize messages
- reject raw received values
- reject non-deterministic or unserializable metadata
- preserve boundary ownership from Potentia, not user-provided payloads

## Trust policy

Do not blindly trust custom issue payloads.

If a future protocol exists, Potentia should normalize every provided issue, override unsafe fields, and drop unrecognized keys.

## Source value

Default generic fallback should use:

```js
source: 'generic'
```

If a generic issue protocol is later introduced but fails validation, fall back to `source: 'generic'` root-level issue rather than exposing the invalid payload.

## Deferred

- implementation
- custom issue protocol
- custom issue validation
- custom field labels/messages
- localization
- support for multiple generic issues

## Blockers

- Generic contracts do not expose safe static field metadata.
- Existing generic validators may throw arbitrary errors; public diagnostics must remain conservative.
