# Registry Hygiene JSR Artifact Dry Run

## Commands run

```bash
npx jsr publish --dry-run --allow-dirty
```

No real JSR publish was run.

## Result

```txt
Success: dry run complete
artifact entries: 36
```

## Included

Required public/runtime files present:

- `README.md`
- `LICENSE`
- `package.json`
- `src/index.js`
- `src/index.d.ts`
- `src/file-routing.js`
- `src/file-routing.d.ts`
- `src/forms.js`
- `src/forms.d.ts`
- `src/dev/file-routing/diagnostics.js`
- `src/dev/file-routing/generator.js`
- `src/dev/file-routing/index.js`
- `src/dev/file-routing/path-mapping.js`
- `src/dev/file-routing/scanner.js`
- `src/dev/file-routing/writer.js`
- `src/kernel/*`

JSR also includes `jsr.json` automatically.

## Excluded

Confirmed absent from the dry-run artifact:

- `.github/`
- `docs/`
- `tests/`
- `examples/`
- `plugins/`
- `scripts/`
- `cli/`
- `.potentia/`
- `bun.lock`
- root exploratory `.mjs` files
- `*.view` files

## Export validation

Public JSR exports remain unchanged and all targets are included:

- `.` -> `./src/index.js`
- `./file-routing` -> `./src/file-routing.js`
- `./forms` -> `./src/forms.js`

## Artifact delta

Before hygiene patch:

```txt
90 manifest entries
```

After hygiene patch dry-run:

```txt
36 manifest entries
```

The artifact is materially tighter while preserving public exports.

## Blockers

None.
