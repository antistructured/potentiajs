# File Routing CLI JSON Envelope Decision

## Files inspected

- `src/cli.js`
- `docs/internal/file-routing-cli-json-output-scope-lock.md`
- `docs/internal/file-routing-cli-check-output-exit.md`

## Decision

Use one shared JSON envelope for `routes generate` and `routes check` command results.

Required fields for resolved route commands:

```txt
ok
command
status
root
output
package
routes
scopes
diagnostics
```

Optional fields:

```txt
hint
```

## Field meanings

- `ok`: boolean success for the command result. Mirrors whether the exit code is success (`0`) or not.
- `command`: resolved command string such as `routes generate` or `routes check`.
- `status`: command-specific machine status.
- `root`: displayed/user-facing route root value.
- `output`: displayed/user-facing output file value.
- `package`: package specifier used in generated output.
- `routes`: generated/scanned route count when available.
- `scopes`: generated/scanned scope count when available.
- `diagnostics`: array of safe diagnostic objects. Always present.
- `hint`: optional human-readable remediation hint, used for missing/stale check output.

## Shape stability

For resolved commands, keep the top-level shape stable by including all required fields even on failure where values are known.

For invalid usage where a command cannot be safely resolved, use a smaller invalid-usage envelope:

```json
{
  "ok": false,
  "command": null,
  "status": "invalid-usage",
  "diagnostics": []
}
```

Do not force route-specific fields into invalid usage when the command/options are not safely resolved.

## Null vs omission

Decision:

- use `null` only when meaningful, such as unresolved `command`
- omit route-specific fields for invalid usage if command/options cannot be resolved
- always include `diagnostics`
- include `hint` only when useful

## Status values

Shared status set:

```txt
generated
current
missing
stale
failed
invalid-usage
```

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
