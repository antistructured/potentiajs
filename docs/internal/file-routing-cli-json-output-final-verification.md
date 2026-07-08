# File Routing CLI JSON Output Design Gate Final Verification

## Commands run

```bash
bun run test
bun run check:release
npm pack --dry-run --json
```

Additional invariant check verified:

- package name unchanged
- version unchanged
- bin unchanged
- root exports unchanged
- file-routing subpath unchanged
- parser still does not implement `--json`
- README does not claim JSON commands exist
- example README does not claim JSON commands exist
- all JSON design docs exist

No publish commands were run.

## Results

### Tests

```txt
583 pass
0 fail
1323 expect() calls
```

### Release check

```txt
583 pass
0 fail
1323 expect() calls
```

### Pack dry-run

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 57
bin/potentia.js: included
src/cli.js: included
docs/internal/: excluded
```

## Design docs created

- `docs/internal/file-routing-cli-json-output-scope-lock.md`
- `docs/internal/file-routing-cli-json-envelope-decision.md`
- `docs/internal/file-routing-cli-generate-json-decision.md`
- `docs/internal/file-routing-cli-check-json-decision.md`
- `docs/internal/file-routing-cli-json-diagnostics-error-decision.md`
- `docs/internal/file-routing-cli-json-output-exit-decision.md`
- `docs/internal/file-routing-cli-json-output-design-report.md`

## Final JSON design decision

Future commands:

```bash
potentia routes generate --json
potentia routes check --json
```

Shared envelope fields for resolved commands:

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

Optional field:

```txt
hint
```

Statuses:

```txt
generated
current
missing
stale
failed
invalid-usage
```

Diagnostics:

```json
{
  "code": "POTENTIA_FILE_ROUTE_COLLISION",
  "path": "routes/users/[id].js",
  "message": "Route collision"
}
```

Invalid usage JSON:

```json
{
  "ok": false,
  "command": null,
  "status": "invalid-usage",
  "diagnostics": [
    {
      "code": "POTENTIA_CLI_INVALID_USAGE",
      "message": "Usage: potentia routes <generate|check> [--root <dir>] [--out <file>] [--package <specifier>] [--cwd <dir>] [--json]"
    }
  ]
}
```

Output destination:

```txt
all JSON envelopes -> stdout
non-JSON fatal process errors -> stderr
```

Exit codes remain unchanged:

```txt
0 = generated/current success
1 = failed/missing/stale/generation or IO error
2 = invalid usage/options
```

## Invariants verified

- no source implementation added
- no parser changes added for JSON
- no package metadata changes for this design block
- no root export changes
- no file-routing subpath changes
- no README claim that `--json` exists
- no example README claim that `--json` exists
- no watch/config/compiler/dev server added
- no release/publish changes

## Remaining blockers

None for this design gate.

Parked release blockers remain separate:

- npm registry visibility
- JSR version visibility
- remote CI/publish workflow failures

## Recommendation

Recommended next file-routing block:

```txt
File Routing CLI JSON Output Foundation
```

Alternative if file routing is mature enough for now:

```txt
Form HTML Rendering Design Gate
```

Alternative if release health is urgent:

```txt
Release Blocker Fix Pass
```

## Publish status

Real publish was not run.
