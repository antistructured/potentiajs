# JSR Export Shape Fix

## Files inspected

- `jsr.json`
- `package.json`
- remote JSR failure message supplied by owner

## Files changed

- `docs/internal/jsr-export-shape-fix.md`

## Current `jsr.json` status

`jsr.json` already uses JSR-compatible string exports in the current working tree:

```json
{
  "exports": {
    ".": "./src/index.js",
    "./file-routing": "./src/file-routing.js",
    "./forms": "./src/forms.js"
  }
}
```

No JSON patch was required in this pass.

## Root cause of remote failure

The failed workflow saw an older/npm-style conditional export shape:

```json
{
  ".": {
    "types": "./src/index.d.ts",
    "import": "./src/index.js"
  }
}
```

JSR does not accept conditional exports in `jsr.json` / `deno.json` export maps.

## Entry points included

Current JSR exports include all current public runtime entrypoints:

- `.` → `./src/index.js`
- `./file-routing` → `./src/file-routing.js`
- `./forms` → `./src/forms.js`

## Include / exclude posture

Current `jsr.json` includes:

- `src/**/*.js`
- `src/**/*.d.ts`
- `README.md`
- `LICENSE`
- `package.json`

and excludes:

- `docs/internal`
- `tests`
- `examples/**/.potentia`

## npm exports

npm conditional exports remain only in `package.json`, where they are valid.

## Acceptance

JSR exports are string paths and include `.`, `./file-routing`, and `./forms`.

## Blockers

None.
