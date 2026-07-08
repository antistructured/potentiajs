# File Routing CLI Check Command Shape Decision

## Files inspected

- `src/cli.js`
- `README.md`
- `examples/file-routing-basic/README.md`
- `docs/internal/file-routing-cli-check-mode-scope-lock.md`
- `docs/internal/file-routing-cli-design-gate-report.md`
- `docs/internal/file-routing-minimal-cli-foundation-final-verification.md`

## Decision

Canonical future command:

```bash
potentia routes check
```

Rationale:

- separates writing from verification
- reads naturally in CI
- avoids `generate` meaning "do not generate"
- gives check mode its own output/exit-code semantics
- leaves `routes generate` simple and explicit

Core message:

```txt
generate writes. check verifies.
```

## Alias decision

`potentia routes generate --check` should be a future alias at most, not the first implementation.

Initial check implementation should reject `generate --check` as unsupported because:

- `generate` currently means write output
- `--check` would invert the command's verb
- adding an alias immediately doubles docs/tests surface
- the canonical command should gather usage evidence first

Future alias status:

```txt
future alias, not first implementation
```

## Flags

`routes check` should support the same flags as `routes generate`:

```txt
--root <dir>
--out <file>
--package <specifier>
--cwd <dir>
```

No new flags in the first check implementation.

## Defaults

Defaults should match `routes generate` exactly:

```txt
root: routes
out: .potentia/routes.generated.js
package: @potentiajs/core
cwd: process.cwd()
```

Equivalent explicit form:

```bash
potentia routes check --root routes --out .potentia/routes.generated.js --package @potentiajs/core
```

## Usage text

Future parser usage should include both implemented commands once check exists, likely:

```txt
Usage: potentia routes <generate|check> [--root <dir>] [--out <file>] [--package <specifier>] [--cwd <dir>]
```

Do not change current usage text in this design block.

## Rejected for first implementation

Rejected canonical shape:

```bash
potentia routes generate --check
```

Rejected because it makes `generate` non-mutating in one mode.

Rejected broader commands:

```bash
potentia check
potentia build
potentia dev
```

These imply broader framework/build/runtime responsibilities.

## Deferred

- `potentia routes generate --check` alias
- `--json`
- `--watch`
- config-file based command defaults

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
