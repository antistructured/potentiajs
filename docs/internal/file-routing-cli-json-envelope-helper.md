# File Routing CLI JSON Envelope Helper

## Files inspected

- `src/cli.js`
- `docs/internal/file-routing-cli-json-envelope-decision.md`
- `docs/internal/file-routing-cli-json-diagnostics-error-decision.md`

## Files changed

- `src/cli.js`
- `docs/internal/file-routing-cli-json-envelope-helper.md`

## Envelope

Implemented internal JSON envelope helpers in `src/cli.js`:

- `createJsonEnvelope(...)`
- `toJsonDiagnostics(...)`

Resolved route command envelopes include:

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

`hint` is included only when present.

The JSON field is `package`, not `packageName`.

## Diagnostics

JSON diagnostics are normalized to safe minimal objects:

```txt
code
path
message
```

`code` and `message` are always present. `path` is included only when a non-absolute path/location is available.

The normalizer does not expose:

- stack traces
- raw thrown errors
- raw `cause` values
- internal object dumps
- generated source

## Blockers

None.

## Publish status

No publish command was run.
