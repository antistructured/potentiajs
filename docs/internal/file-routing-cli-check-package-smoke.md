# File Routing CLI Check Package Smoke

## Files inspected

- `package.json`
- `bin/potentia.js`
- `src/cli.js`
- `npm pack --dry-run --json` output
- packed artifact smoke output

## Files changed

- `docs/internal/file-routing-cli-check-package-smoke.md`

## Checks run

```bash
bun run test
bun run check:release
npm pack --dry-run --json
npm pack --pack-destination <tmp> --json
```

Then a fresh temporary project installed the local tarball and exercised:

```bash
./node_modules/.bin/potentia routes check
./node_modules/.bin/potentia routes generate
./node_modules/.bin/potentia routes check
```

No publish commands were run.

## Test result

```txt
583 pass
0 fail
1323 expect() calls
```

## Release check result

```txt
583 pass
0 fail
1323 expect() calls
```

## Pack result

Pack dry-run passed.

Package summary:

- package: `@potentiajs/core`
- version: `0.1.0-preview.0`
- entry count: `57`
- includes `bin/potentia.js`: yes
- includes `src/cli.js`: yes
- includes `docs/internal/`: no

## Installed CLI smoke

Temp route tree:

```txt
routes/
  index.js
  users/
    [id].js
```

### Missing check

Command:

```bash
./node_modules/.bin/potentia routes check
```

Result:

- exit code: `1`
- output file created: no
- `.potentia/` created: no

stderr:

```txt
File routes are not generated:
- output: .potentia/routes.generated.js
- run: potentia routes generate
```

### Generate

Command:

```bash
./node_modules/.bin/potentia routes generate
```

stdout:

```txt
Generated file routes:
- root: routes
- output: .potentia/routes.generated.js
- routes: 2
- scopes: 0
```

### Current check

Command:

```bash
./node_modules/.bin/potentia routes check
```

Result:

- exit code: `0`

stdout:

```txt
File routes are current:
- root: routes
- output: .potentia/routes.generated.js
- routes: 2
- scopes: 0
```

### Stale check

Generated output was replaced with:

```txt
// stale
```

Command:

```bash
./node_modules/.bin/potentia routes check
```

Result:

- exit code: `1`
- stale file content after check: unchanged (`// stale`)

stderr:

```txt
File routes are stale:
- output: .potentia/routes.generated.js
- run: potentia routes generate
```

### Route smoke

After restoring generated output, imported generated routes into `createApp(...)` and verified route behavior.

Smoke output:

```json
{"rootStatus":200,"rootBody":"home","userStatus":200,"userBody":{"id":"ada"},"generatedHasHeader":true,"generatedHasPackageImport":true,"generatedHasRuntimeFs":false,"binExists":true}
```

## Cleanup status

Temporary pack and smoke directories were removed after the smoke completed.

## Blockers

None.

## Publish status

No publish command was run.
