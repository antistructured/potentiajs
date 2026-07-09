# CLI Package Regression Full Verification

## Commands run

```bash
bun run test
bun run check:preview
bun run check:release
npm pack --dry-run --json
```

No publish command was run.

## Results

### `bun run test`

```txt
609 pass
0 fail
1487 expect() calls
```

### `bun run check:preview`

```txt
609 pass
0 fail
1487 expect() calls
```

### `bun run check:release`

```txt
609 pass
0 fail
1487 expect() calls
```

### `npm pack --dry-run --json`

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 56
```

Required package files present:

- `bin/potentia.js`
- `src/cli.js`
- `src/file-routing.js`
- `src/forms.js`

Excluded package files absent:

- `docs/internal/`
- `tests/`
- `examples/**/.potentia/`

## Acceptance

- full test suite passes
- preview check passes
- release check passes
- pack dry-run passes
- CLI binary is included
- CLI source is included
- root API remains clean
- no publish occurred
