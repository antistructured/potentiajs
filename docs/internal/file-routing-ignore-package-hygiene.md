# File Routing Ignore / Package Hygiene

## Files inspected

- `.gitignore`
- `package.json`
- `README.md`
- `tests/file-routing-generated-smoke.test.js`
- `tests/file-routing-writer.test.js`
- `tests/file-routing-script.test.js`
- `npm pack --dry-run --json` output

## Files changed

- `.gitignore`
- `docs/internal/file-routing-ignore-package-hygiene.md`

## Work completed

Added generated route output directory to `.gitignore`:

```txt
.potentia/
```

Confirmed package hygiene remains protected by package `files` allowlist.

Packed package contents continue to include only:

- `README.md`
- selected shipped examples
- `package.json`
- `src/index.js`
- `src/kernel/`

Confirmed pack excludes:

- root `.potentia/`
- tests
- `docs/internal/`
- `src/dev/file-routing/`
- fixture-generated output

## Verification

```bash
npm pack --dry-run --json
```

Result:

- entry count: 23
- root `.potentia/` packed: false
- tests packed: false
- `docs/internal/` packed: false
- `src/dev/file-routing/` packed: false
- root `.potentia/` exists after tests: false
- fixture generated output exists after tests: false

## Decision

Generated `.potentia/routes.generated.js` is a dev/build artifact. It should be ignored by default in this repository and excluded from package output.

Future user projects may choose to commit generated output for deployment reproducibility, but Potentia does not require or model that policy yet.

## Blockers

- No `.npmignore` exists; package hygiene relies on the current `files` allowlist.
- If a future block includes `src/dev/` or examples/file-routing generated output in package `files`, pack hygiene must be re-audited.
