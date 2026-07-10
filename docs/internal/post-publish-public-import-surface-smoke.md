# Post-Publish Public Import Surface Smoke

## Temp project

```txt
/tmp/potentia-public-install-smoke
```

## Commands run

```bash
node smoke.mjs
```

## Smoke coverage

The smoke script imported the installed public registry package:

```js
import * as core from '@potentiajs/core';
import * as fileRouting from '@potentiajs/core/file-routing';
import * as forms from '@potentiajs/core/forms';
```

It verified required root exports:

- `createApp`
- `route`
- `action`
- `projectForm`
- `createFormState`

It verified subpath exports:

- `@potentiajs/core/file-routing` → `generateFileRoutes`
- `@potentiajs/core/forms` → `renderForm`

It verified root exclusions:

- `generateFileRoutes` absent from root
- `renderForm` absent from root

It also rendered a minimal form via the installed `renderForm(...)` export.

## Result

```json
{
  "core": 5,
  "fileRouting": ["generateFileRoutes"],
  "forms": ["renderForm"],
  "rootHasGenerateFileRoutes": false,
  "rootHasRenderForm": false,
  "formRenderer": true
}
```

## Confirmed

- root import works from registry install
- file-routing subpath import works from registry install
- forms subpath import works from registry install
- root exports remain unpolluted
- form renderer works from registry install

## Blockers

None.
