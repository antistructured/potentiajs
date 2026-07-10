# 0.1.0 Package Metadata Final Review

## Files and registry data inspected

- `package.json`
- `jsr.json`
- npm metadata for `@potentiajs/core@0.1.0-preview.1`
- JSR metadata for `@potentiajs/core@0.1.0-preview.1`

## Metadata

### npm package

- name: `@potentiajs/core`
- current version before final bump: `0.1.0-preview.1`
- description: `JavaScript framework kernel for contract-driven routing, actions, and form metadata.`
- license: `MIT`
- repository: `git+https://github.com/antistructured/potentiajs.git`
- homepage: `https://github.com/antistructured/potentiajs#readme`
- type: `module`
- binary: `potentia -> ./bin/potentia.js`
- runtime dependency: `@weipertda/sigiljs@0.18.0`
- dev dependencies: none
- peer dependencies: none

### npm exports

- `.` -> `./src/index.js` with `./src/index.d.ts`
- `./file-routing` -> `./src/file-routing.js` with `./src/file-routing.d.ts`
- `./forms` -> `./src/forms.js` with `./src/forms.d.ts`

### npm files

Intentionally shipped:

- `bin/`
- `src/`
- `examples/file-routing-basic/`
- `examples/full-flow-basic/`
- `examples/form-rendering-basic/`
- `README.md`
- `CHANGELOG.md`
- `LICENSE`

### JSR package

- name: `@potentiajs/core`
- current version before final bump: `0.1.0-preview.1`
- exports: `.`, `./file-routing`, `./forms`
- publish artifact: lean source/docs package via `publish.include` / `publish.exclude`
- current preview.1 JSR manifest count: `36`
- unexpected repo-only files in preview.1 JSR artifact: none detected

## Registry preview.1 metadata

npm preview.1 is visible:

```json
{
  "name": "@potentiajs/core",
  "version": "0.1.0-preview.1",
  "dist-tags": {
    "preview": "0.1.0-preview.1",
    "latest": "0.1.0-preview.0"
  }
}
```

JSR preview.1 is visible:

```json
{
  "versions": ["0.1.0-preview.0", "0.1.0-preview.1"],
  "exports": {
    ".": "./src/index.js",
    "./file-routing": "./src/file-routing.js",
    "./forms": "./src/forms.js"
  },
  "manifestCount": 36
}
```

## Decisions

1. Description remains acceptable for `0.1.0`.
   - It is concise, avoids overclaiming production readiness, and identifies the kernel/form/action/routing scope.
2. Keywords are appropriate.
   - They cover routing, contracts, forms, actions, Bun, and framework identity.
3. Final npm publish should intentionally set `latest -> 0.1.0`.
4. Examples intentionally ship to npm.
   - They help npm consumers understand file routing, form rendering, and full-flow usage.
5. JSR is intentionally leaner than npm.
   - JSR ships source/types/readme/license/package metadata, not examples or repo-only docs.
6. CLI is intentionally npm-only for now.
   - `bin/potentia.js` ships in npm package contents and is excluded from JSR.
7. Static `publishConfig.tag: preview` should be removed before final.
   - The workflow should compute `preview` vs `latest` from the version instead of hard-coding preview metadata.

## Changes made

None in this pass. The static `publishConfig.tag` change belongs to the publish posture pass.

## Blockers

None.
