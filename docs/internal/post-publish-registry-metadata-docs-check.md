# Post-Publish Registry Metadata / Docs Check

## npm commands

```bash
npm view @potentiajs/core@preview name version description license homepage repository dist-tags --json
npm view @potentiajs/core@preview readme
```

## npm metadata

```json
{
  "name": "@potentiajs/core",
  "version": "0.1.0-preview.0",
  "description": "Experimental Bun-first JavaScript framework kernel for contract-driven routing, actions, and form metadata.",
  "license": "MIT",
  "homepage": "https://github.com/antistructured/potentiajs#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/antistructured/potentiajs.git"
  },
  "dist-tags": {
    "preview": "0.1.0-preview.0",
    "latest": "0.1.0-preview.0"
  }
}
```

## npm README check

Confirmed from npm registry README content:

- README is present
- README starts with `# PotentiaJS`
- README references `@potentiajs/core`
- README includes preview/non-production warning language
- README length is non-empty (`17208` chars)

## npm installed package contents

Fresh registry install contains `56` files.

Required files present:

- `README.md`
- `CHANGELOG.md`
- `LICENSE`
- `bin/potentia.js`
- `src/index.js`
- `src/file-routing.js`
- `src/forms.js`

Excluded files absent:

- `docs/internal/`
- `tests/`
- generated `.potentia/` output

Public examples present and intentional:

- `examples/file-routing-basic/`
- `examples/form-rendering-basic/`
- `examples/full-flow-basic/`

## JSR checks

Commands/inspection:

```bash
npx jsr info @potentiajs/core
curl -fsSL https://jsr.io/@potentiajs/core
curl -fsSL https://jsr.io/@potentiajs/core/meta.json
curl -fsSL https://jsr.io/@potentiajs/core/0.1.0-preview.0_meta.json
```

Confirmed from JSR command/page/metadata:

- package page is visible
- version `0.1.0-preview.0` is visible
- README text renders on package page
- description text is visible
- exports include `.`, `./file-routing`, and `./forms`
- no export parse errors occur

## Findings

### npm

npm metadata/docs are acceptable for a preview release.

One note: npm `latest` currently points to `0.1.0-preview.0` in addition to `preview`. This does not break install verification, but if the desired posture is preview-only discoverability, future publish workflow/publishConfig should prevent or correct `latest` tagging.

### JSR

JSR metadata/docs are visible and exports are correct.

However, JSR version metadata indicates the published JSR artifact includes more repo files than intended, including workflow/dev-example-style paths. This should be tightened in a follow-up patch-release hygiene pass by auditing the `jsr.json` include/exclude rules and JSR publish behavior.

## Blockers

None for public registry usability.

Follow-up issues documented:

- npm `latest` tag points to preview version
- JSR package contents appear broader than intended
