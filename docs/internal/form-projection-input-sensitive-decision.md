# Form Projection Input Type / Sensitive Field Decision

## Files inspected

- `src/kernel/form-state.js`
- `src/kernel/contract-projection.js`
- `docs/internal/form-projection-field-metadata-shape-decision.md`
- `docs/internal/form-state-helper-foundation-report.md`

## Files changed

- `docs/internal/form-projection-input-sensitive-decision.md`

## Decision summary

Input type inference should be conservative, metadata-only, and renderer-neutral. It produces hints, not validation.

Server-side contracts remain authoritative.

## Primitive mappings

Recommended initial mappings:

| Projected contract kind | Input hint |
| --- | --- |
| `string` | `text` |
| `number` / `integer` | `number` |
| `boolean` | `checkbox` |
| scalar array | `text` with `multiple: true` |
| object | nested/grouped field projection |
| unknown | `text` |

## Name-based hints

Name-based hints are allowed only for common safe cases:

- `email` → `input.type: 'email'`, `autocomplete: 'email'`
- `url` / `website` → `input.type: 'url'`
- `phone` / `tel` → `input.type: 'tel'`, `autocomplete: 'tel'`
- `password` / `confirmPassword` / `currentPassword` / `newPassword` → `input.type: 'password'`
- unknown names → fallback to contract primitive mapping

Name hints must not create validation semantics. A field named `email` is only valid if the server contract accepts it.

## Input mode and autocomplete

Initial `input.mode` should default to `null` unless explicitly derivable from stable metadata.

Autocomplete hints may be set for safe conventional fields such as `email`, `tel`, and password variants. Tokens/secrets/auth fields should not get optimistic autocomplete values unless explicit metadata later supplies them.

## Sensitive detection

Sensitive detection should align with `createFormState(...)` value omission.

A field is sensitive when any normalized path/name segment contains or matches:

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

Sensitive fields project:

```js
sensitive: true
```

## Sensitive rendering posture

Sensitive field projection does not decide final rendering.

- Password-like fields may suggest `input.type: 'password'`.
- Token/secret/api/auth/session/cookie fields should project `sensitive: true`, but a renderer may choose password, hidden, omitted, or custom rendering later.
- Sensitive fields must not preserve submitted values.

## Override policy

Explicit metadata overrides should be supported later, but not invented in this design gate.

Future explicit metadata may override:

- `sensitive`
- `input.type`
- `autocomplete`
- label/help/placeholder

Overrides must remain server-authoritative metadata and must not trust client state.

## Deferred

- implementation
- explicit metadata override API
- renderer behavior
- full autocomplete vocabulary
- hidden input policy
- password manager policy
- client validation

## Blockers

- Name-based sensitivity can produce false positives/negatives.
- Contract metadata does not yet expose explicit sensitivity overrides.
