# Registry Hygiene JSR Schema Verification

## Commands run

```bash
npx jsr --help
npx jsr publish --help
npx jsr publish --dry-run --allow-dirty
```

Additional local schema probes were run by temporarily writing candidate `jsr.json` variants, running `npx jsr publish --dry-run --allow-dirty`, parsing the emitted file list, and restoring the original `jsr.json` afterward.

No real publish command was run.

## Findings

### Current top-level include/exclude behavior

The current `jsr.json` uses top-level `include` and `exclude`.

Dry-run result with current config:

```txt
exit: 0
artifact still broad
```

The dry-run included examples, workflow files, root exploratory `.mjs` files, scripts, plugins, and other repo-only paths. Therefore the current top-level config does not constrain the artifact as intended.

### `publish.include` / `publish.exclude` behavior

A temporary candidate using:

```json
{
  "publish": {
    "include": [
      "src/**/*.js",
      "src/**/*.d.ts",
      "README.md",
      "LICENSE",
      "package.json"
    ],
    "exclude": [
      ".github",
      "docs",
      "tests",
      "examples",
      "plugins",
      "scripts",
      "cli",
      ".potentia",
      "bun.lock",
      "*.mjs",
      "*.view"
    ]
  }
}
```

produced:

```txt
exit: 0
artifact entries: 36
unexpected repo-only entries: 0
```

Included expected runtime/source files such as:

- `README.md`
- `LICENSE`
- `package.json`
- `src/index.js`
- `src/index.d.ts`
- `src/file-routing.js`
- `src/file-routing.d.ts`
- `src/forms.js`
- `src/forms.d.ts`
- `src/dev/file-routing/*`
- `src/kernel/*`

JSR also included `jsr.json` automatically even though it was not listed in `publish.include`.

## Required questions

### 1. Does JSR support `include`?

Yes, as `publish.include` for the current CLI behavior verified by dry-run.

### 2. Does JSR support `exclude`?

Yes, as `publish.exclude` for the current CLI behavior verified by dry-run.

### 3. Are glob patterns accepted?

Yes. Patterns such as `src/**/*.js` and `src/**/*.d.ts` were accepted and constrained the emitted file list.

### 4. Does JSR use `include` as an allowlist?

Yes when expressed under `publish.include`; dry-run output narrowed from the broad artifact to 36 entries.

### 5. Does JSR include `package.json` automatically or only if included?

`package.json` should be explicitly included. The successful lean dry-run included it because it was listed.

JSR appears to include `jsr.json` automatically.

### 6. Does JSR require all exported files to be inside included files?

Yes in practice: all exported files must be included for publish validation to pass. The candidate included all export targets:

- `src/index.js`
- `src/file-routing.js`
- `src/forms.js`

### 7. Does JSR require type files to be included separately?

Type files should be included separately. The candidate included `src/**/*.d.ts`, which preserved:

- `src/index.d.ts`
- `src/file-routing.d.ts`
- `src/forms.d.ts`

## Supported config

Use `publish.include` and `publish.exclude`, not the current top-level include/exclude shape.

## Blockers

None. Schema is verified enough to patch `jsr.json` and validate with another dry-run.
