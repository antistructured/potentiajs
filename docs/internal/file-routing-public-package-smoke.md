# File Routing Public Package / Installed Artifact Smoke

## Files inspected

- `package.json`
- `src/file-routing.js`
- `src/file-routing.d.ts`
- `src/dev/file-routing/`
- `npm pack --dry-run --json` output
- packed artifact smoke output

## Files changed

- `docs/internal/file-routing-public-package-smoke.md`

## Checks run

```bash
bun run test
bun run check:release
npm pack --dry-run --json
npm pack --pack-destination <tmp> --json
```

Then a fresh temp project installed the local tarball and imported:

```js
import { createApp } from '@potentiajs/core';
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```

## Test result

```txt
564 pass
0 fail
1204 expect() calls
```

## Release check result

```txt
564 pass
0 fail
1204 expect() calls
```

## Pack result

`npm pack --dry-run --json` passed.

Package summary:

- name: `@potentiajs/core`
- version: `0.1.0-preview.0`
- entry count: `48`
- includes `src/file-routing.js`: yes
- includes `src/file-routing.d.ts`: yes
- includes `src/dev/file-routing/`: yes
- includes `docs/internal/`: no
- includes tests: no
- includes `.potentia/`: no

## Packed install smoke

Temp route tree:

```txt
routes/
  index.js
  users/
    index.js
    [id].js
```

Smoke steps:

1. install packed tarball in fresh temp project
2. import root package
3. import `@potentiajs/core/file-routing`
4. run `generateFileRoutes({ rootDir: 'routes', outputFile: '.potentia/routes.generated.js' })`
5. import generated `.potentia/routes.generated.js`
6. create app with generated routes
7. request `/`
8. request `/users/ada`

Observed smoke output:

```json
{"packageName":"@potentiajs/core","version":"0.1.0-preview.0","rootStatus":200,"rootBody":"home","userStatus":200,"userBody":{"id":"ada"},"routes":3,"scopes":0,"generatedHasPackageImport":true,"generatedHasHeader":true,"generatedHasRuntimeFs":false,"subpathType":"function"}
```

## Cleanup result

Temporary pack and smoke directories were removed after the smoke completed.

## Publish status

No real publish command was run.
