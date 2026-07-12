# 0.2.0 Package Metadata / Registry Posture Review

## Metadata

Inspected:

- `package.json`
- `jsr.json`
- `.github/workflows/publish.yml`

Confirmed package metadata:

- package name: `@potentiajs/core`
- current pre-bump version at review time: `0.2.0-preview.1`
- description: `JavaScript framework kernel for contract-driven routing, actions, and form metadata.`
- license: `MIT`
- repository: `git+https://github.com/antistructured/potentiajs.git`
- homepage: `https://github.com/antistructured/potentiajs#readme`
- package is public (`private: false`, `publishConfig.access: public`)
- runtime dependency remains `@weipertda/sigiljs@0.18.0`

## Registry posture

Package exports:

- `.`
- `./file-routing`
- `./forms`
- `./html`

`./html` export includes:

- runtime: `./src/html.js`
- types: `./src/html.d.ts`

npm package files intentionally include:

- `bin/`
- `src/`
- `examples/file-routing-basic/`
- `examples/full-flow-basic/`
- `examples/form-rendering-basic/`
- `examples/html-basic/`
- `README.md`
- `CHANGELOG.md`
- `LICENSE`

npm examples are intentionally included for public learning/smoke use.

JSR posture:

- exports include `./html`
- `publish.include` includes `src/**/*.js`, `src/**/*.d.ts`, `README.md`, `LICENSE`, and `package.json`
- examples are intentionally excluded from JSR
- CLI/bin are intentionally excluded from JSR
- docs/tests/scripts/plugins/generated output are excluded from JSR
- JSR artifact remains lean by configuration

## Workflow

`.github/workflows/publish.yml` confirms:

- verify job checks `package.json` and `jsr.json` versions match
- verify job runs `bun run check:release`
- npm publish reads `package.json` name/version
- npm tag selection is computed from version:
  - versions containing `-preview.` publish with `--tag preview`
  - final versions publish with `--tag latest`
- `0.2.0` final will therefore publish to npm `latest`
- `0.2.0-preview.1` remains expected as npm `preview` after final publish
- JSR publish checks whether the exact version already exists before publishing

## Changes made

- Created `docs/internal/020-package-registry-posture-review.md`.
- No package/workflow changes were required in this pass.

## Blockers

None.
