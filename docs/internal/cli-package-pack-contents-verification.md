# CLI Package Pack Contents Verification

## Command run

```bash
npm pack --dry-run --json
```

## Result

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 56
```

## Required package files

Verified present in the dry-run tarball:

- `bin/potentia.js`
- `src/cli.js`
- `src/file-routing.js`
- `src/forms.js`

## Exclusions

Verified absent from the dry-run tarball:

- `docs/internal/`
- `tests/`
- `examples/**/.potentia/`

## Export/package surface audit from same check

Live import audit confirmed:

```txt
root forbidden exports: absent
file-routing exports: generateFileRoutes
forms exports: renderForm
```

## Acceptance

- packed artifact includes CLI binary
- packed artifact includes CLI source used by binary
- packed artifact excludes internal docs/tests/generated output
