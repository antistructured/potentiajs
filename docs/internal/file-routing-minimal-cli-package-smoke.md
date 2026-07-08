# File Routing Minimal CLI Package Smoke

## Files inspected

- `package.json`
- `bin/potentia.js`
- `src/cli.js`
- `npm pack --dry-run --json` output
- packed artifact smoke output

## Files changed

- `docs/internal/file-routing-minimal-cli-package-smoke.md`

## Checks run

```bash
bun run test
bun run check:release
npm pack --dry-run --json
npm pack --pack-destination <tmp> --json
```

Then a fresh temporary project installed the local tarball and ran:

```bash
./node_modules/.bin/potentia routes generate
```

No publish commands were run.

## Test result

```txt
573 pass
0 fail
1271 expect() calls
```

## Release check result

```txt
573 pass
0 fail
1271 expect() calls
```

## Pack result

Pack dry-run passed.

Package summary:

- package: `@potentiajs/core`
- version: `0.1.0-preview.0`
- entry count: `57`
- includes `bin/potentia.js`: yes
- includes `src/cli.js`: yes
- includes `examples/file-routing-basic/`: yes
- includes `docs/internal/`: no

## Installed CLI smoke

Temp route tree:

```txt
routes/
  index.js
  users/
    [id].js
```

Smoke steps:

1. create temp project
2. install local packed tarball
3. create route tree
4. run `./node_modules/.bin/potentia routes generate`
5. verify `.potentia/routes.generated.js`
6. import generated routes into `createApp(...)`
7. verify `/`
8. verify `/users/ada`
9. remove temp directories

CLI stdout:

```txt
Generated file routes:
- root: routes
- output: .potentia/routes.generated.js
- routes: 2
- scopes: 0
```

CLI stderr:

```txt

```

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
