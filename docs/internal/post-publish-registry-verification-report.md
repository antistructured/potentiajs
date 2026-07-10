# Post-Publish Registry Verification Report

## Published package

- npm: `@potentiajs/core`
- JSR: `@potentiajs/core`
- version: `0.1.0-preview.0`
- npm tag: `preview -> 0.1.0-preview.0`

## Pass 1 — Registry Verification Scope Lock

Created:

- `docs/internal/post-publish-registry-verification-scope-lock.md`

Result:

- scope locked to public registry verification
- no source feature changes
- no version bump
- no publish command

## Pass 2 — npm Registry Visibility Check

Created:

- `docs/internal/post-publish-npm-registry-visibility.md`

Commands confirmed:

- `npm view @potentiajs/core version`
- `npm view @potentiajs/core versions --json`
- `npm view @potentiajs/core dist-tags --json`
- `npm view @potentiajs/core@0.1.0-preview.0 name version dist.tarball`
- `npm view @potentiajs/core@preview version`

Results:

```txt
package visible: yes
version visible: 0.1.0-preview.0
preview tag: 0.1.0-preview.0
tarball URL: present
name: @potentiajs/core
```

Note:

```txt
latest also points to 0.1.0-preview.0
```

## Pass 3 — JSR Registry Visibility Check

Created:

- `docs/internal/post-publish-jsr-registry-visibility.md`

Commands/inspection confirmed:

- `npx jsr info @potentiajs/core`
- JSR package metadata API
- JSR version metadata API

Results:

```txt
package visible: yes
version visible: 0.1.0-preview.0
exports visible: ., ./file-routing, ./forms
export parse errors: none
```

Finding:

```txt
JSR artifact contents appear broader than intended and should be tightened in a follow-up patch-release hygiene pass.
```

## Pass 4 — Fresh npm Install Smoke

Created:

- `docs/internal/post-publish-fresh-npm-install-smoke.md`

Temp project:

```txt
/tmp/potentia-public-install-smoke
```

Commands confirmed:

- `npm init -y`
- `npm install @potentiajs/core@preview`
- `npm ls @potentiajs/core`
- binary existence check

Result:

```txt
@potentiajs/core@0.1.0-preview.0 installed from public npm registry
node_modules/.bin/potentia present
```

## Pass 5 — Public Import Surface Smoke

Created:

- `docs/internal/post-publish-public-import-surface-smoke.md`

Smoke imported from actual registry install:

```js
import * as core from '@potentiajs/core';
import * as fileRouting from '@potentiajs/core/file-routing';
import * as forms from '@potentiajs/core/forms';
```

Result:

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

Confirmed:

- root import works
- file-routing subpath import works
- forms subpath import works
- root exports remain unpolluted
- form renderer works from registry install

## Pass 6 — Public CLI Smoke

Created:

- `docs/internal/post-publish-public-cli-smoke.md`

Commands confirmed from registry install:

- `./node_modules/.bin/potentia routes check --json`
- `./node_modules/.bin/potentia routes generate --json`
- `./node_modules/.bin/potentia routes check --json`
- generated routes imported into `createApp(...)`

Results:

```txt
first check: exit 1, status missing, no .potentia/ written
generate: exit 0, status generated, .potentia/routes.generated.js written
second check: exit 0, status current
```

App smoke:

```json
{
  "rootStatus": 200,
  "rootBody": "home",
  "userStatus": 200,
  "userBody": {
    "id": "ada"
  }
}
```

## Pass 7 — Registry Metadata / Docs Check

Created:

- `docs/internal/post-publish-registry-metadata-docs-check.md`

npm metadata:

```json
{
  "name": "@potentiajs/core",
  "version": "0.1.0-preview.0",
  "description": "Experimental Bun-first JavaScript framework kernel for contract-driven routing, actions, and form metadata.",
  "license": "MIT",
  "homepage": "https://github.com/antistructured/potentiajs#readme",
  "repository": "git+https://github.com/antistructured/potentiajs.git"
}
```

npm README:

- present
- renders from registry content
- starts with `# PotentiaJS`
- includes preview/non-production warning language
- references `@potentiajs/core`

JSR docs/metadata:

- package page visible
- README visible
- description visible
- exports visible
- version visible

## Public smoke summary

- install: pass
- root import: pass
- file-routing import: pass
- forms import: pass
- CLI: pass
- generated routes: pass
- form renderer: pass

## Issues found

1. npm `latest` also points to `0.1.0-preview.0`.
   - This does not block public usability.
   - If preview-only tagging is desired, correct dist-tag posture in a follow-up registry hygiene pass.

2. JSR artifact contents appear broader than intended.
   - JSR version metadata includes repo/workflow/dev-example-style paths beyond the narrow package surface.
   - This does not block imports or exports.
   - Tighten `jsr.json` include/exclude behavior in a follow-up patch release.

## Remaining blockers

None for public registry usability of `@potentiajs/core@0.1.0-preview.0`.

## Recommendation

Treat `@potentiajs/core@0.1.0-preview.0` as publicly verified for npm install, root/subpath imports, CLI use, generated routes, and form rendering.

Recommended next block:

```txt
Registry Hygiene Patch Planning Pass
```

Focus:

- decide npm `latest` vs preview-only dist-tag posture
- tighten JSR package include/exclude contents
- optionally cut a small patch preview only if public artifact hygiene warrants it
