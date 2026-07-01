# Form State Safe Value Preservation Decision

## Files inspected

- `src/kernel/action.js`
- `src/kernel/diagnostics.js`
- `tests/kernel-action-urlencoded-input.test.js`
- `tests/kernel-action-urlencoded-parser.test.js`
- `docs/internal/field-level-contract-diagnostics-implementation-report.md`
- `docs/internal/form-state-response-scope-lock.md`

## Files changed

- `docs/internal/form-state-safe-value-preservation-decision.md`

## Decision summary

Future form responses should preserve submitted values on validation and intentional domain failures, but only from parsed input and only when the value is safe to echo.

Do not preserve values for handler failures, output failures, malformed body parse failures, or unsupported content-type failures.

## Source of preserved values

Value preservation must use parsed action input, not raw request bodies.

Accepted sources:

- parsed JSON object input
- parsed URL-encoded object input
- post-contract parsed input only when it does not hide/transform sensitive raw data in unsafe ways

Rejected sources:

- raw request body text
- raw `FormData`
- raw files/blobs
- thrown errors
- arbitrary validator internals

## Preservable value types

Preserve by default:

- strings
- numbers
- booleans
- `null`
- arrays of safe scalar values
- shallow/nested plain objects whose leaves are safe scalar values and whose path names are not sensitive

Do not preserve:

- functions
- symbols
- bigints unless converted through an explicit future policy
- `File` / `Blob` / binary values
- class instances
- unserializable objects
- cyclic objects
- raw unknown objects with unsafe prototypes

URL-encoded repeated fields may preserve arrays of strings.

## Sensitive field policy

Initial sensitive detection should be name-based and conservative.

Denylist segments, case-insensitive:

```txt
password
confirmPassword
currentPassword
newPassword
token
secret
apiKey
authorization
auth
credential
session
cookie
```

A field is sensitive if any path segment normalizes to one of these names, including nested fields such as `profile.password` or array paths such as `credentials[0].token`.

Future contract/form metadata may override or expand sensitivity, but the first implementation should not require that metadata.

## Sensitive value handling

Omit sensitive fields from preserved values by default rather than preserving empty strings.

Reasoning:

- omission avoids accidentally implying a submitted secret was retained
- templates can render an empty input when no value exists
- redaction strings can accidentally become submitted values if copied back into forms

A future helper may support explicit empty-string placeholders for UI convenience, but omission is the safer default.

## Unknown fields

Unknown fields may be preserved only if they are present in parsed input, serializable as safe values, and not sensitive.

Future form helpers may filter values by projected contract fields, but that requires reliable contract metadata and is deferred.

## Domain failures

Intentional domain failures may preserve safe parsed values because they are part of normal form correction flows, for example `USER_EMAIL_TAKEN`.

Domain failures should not preserve values if the failure did not originate from a submitted form/action flow or if no parsed input is available.

## Handler/output failures

Handler failures and output failures should not preserve submitted values by default.

Reasons:

- they indicate server-side faults or internal output mismatches
- they may occur after side effects
- they are not normal form correction paths

## Deferred

- implementation
- explicit sensitivity metadata
- contract-driven field filtering
- multipart/file preservation policy
- session/flash persistence
- localization/labels

## Blockers

- Without explicit form metadata, name-based sensitivity can produce false positives/negatives.
- Nested JSON preservation requires careful cycle/prototype handling during implementation.
