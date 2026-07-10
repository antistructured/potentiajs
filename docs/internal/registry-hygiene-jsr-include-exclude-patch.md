# Registry Hygiene JSR Include/Exclude Patch

## Files changed

- `jsr.json`
- `docs/internal/registry-hygiene-jsr-include-exclude-patch.md`

## Schema used

Pass 2 verified that the current JSR CLI constrains artifact contents using:

```json
{
  "publish": {
    "include": [],
    "exclude": []
  }
}
```

Top-level `include` / `exclude` did not constrain the artifact as intended.

## JSR include

`jsr.json` now includes only:

```json
[
  "src/**/*.js",
  "src/**/*.d.ts",
  "README.md",
  "LICENSE",
  "package.json"
]
```

## JSR exclude

`jsr.json` now excludes:

```json
[
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
```

## Public exports

Public JSR exports remain unchanged:

```json
{
  ".": "./src/index.js",
  "./file-routing": "./src/file-routing.js",
  "./forms": "./src/forms.js"
}
```

## Rationale

This preserves the public module surface while removing repo-only package contents from JSR.

`src/dev/file-routing/**` remains included because `@potentiajs/core/file-routing` currently exports `generateFileRoutes` from `src/dev/file-routing/writer.js`.

`bin/potentia.js` is not included on JSR because this pass verifies JSR module imports/exports, not npm binary installation. npm continues to ship the binary via `package.json.files` and `bin`.

Examples remain included in npm package contents but are excluded from JSR for a leaner module artifact.

## Blockers

None pending Pass 4 dry-run verification.
