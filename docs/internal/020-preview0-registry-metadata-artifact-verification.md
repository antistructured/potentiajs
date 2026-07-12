# 0.2.0-preview.0 Registry Metadata / Artifact Verification

## npm

Command:

```bash
npm view @potentiajs/core@preview name version description license homepage repository dist-tags --json
npm view @potentiajs/core@preview readme
```

Metadata:

```json
{
  "name": "@potentiajs/core",
  "version": "0.2.0-preview.0",
  "description": "JavaScript framework kernel for contract-driven routing, actions, and form metadata.",
  "license": "MIT",
  "homepage": "https://github.com/antistructured/potentiajs#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/antistructured/potentiajs.git"
  },
  "dist-tags": {
    "preview": "0.2.0-preview.0",
    "latest": "0.1.0"
  }
}
```

npm installed package contents:

- installed file count: `60`
- `src/html.js`: present
- `src/html.d.ts`: present
- `examples/html-basic/`: present intentionally
- `docs/internal/`: absent
- `tests/`: absent
- generated `.potentia/`: absent

README posture:

- installed package `README.md` is present
- installed README contains `@potentiajs/core/html`
- installed README contains `HTML-first responses`
- installed README contains `0.2.0-preview.0`
- installed README preserves no-JSX/no-compiler posture

Note: `npm view ... readme` returned an empty string in this CLI check, but the registry-installed package tarball includes the README with the expected HTML documentation. This is recorded as non-blocking because package usability and artifact contents are correct.

## JSR

JSR metadata from `https://jsr.io/@potentiajs/core/0.2.0-preview.0_meta.json` confirms:

- version `0.2.0-preview.0` metadata is reachable
- exports visible:
  - `.`
  - `./file-routing`
  - `./forms`
  - `./html`
- manifest count: `38`
- `src/html.js`: present
- `src/html.d.ts`: present
- examples excluded: yes
- CLI excluded: yes
- docs excluded: yes

## Artifact posture

Intentional posture after preview publish:

- npm ships CLI, examples, and `examples/html-basic`
- npm excludes internal docs, tests, and generated output
- JSR ships lean source/types/readme/license/package metadata
- JSR excludes examples, CLI, repo-only docs, tests, scripts, plugins, and generated output

## Issues

Non-blocking:

- `npm view @potentiajs/core@preview readme` returned an empty string, while the installed registry package includes the expected README. No install/import/API usability issue was found.
- GitHub Actions emitted non-blocking setup-node warnings during publish; they did not affect publication or public smoke checks.

## Blockers

None.
