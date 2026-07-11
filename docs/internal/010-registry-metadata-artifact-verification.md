# 0.1.0 Registry Metadata / Artifact Verification

## npm

Command:

```bash
npm view @potentiajs/core@latest name version description license homepage repository dist-tags --json
npm view @potentiajs/core@latest readme
```

Metadata:

```json
{
  "name": "@potentiajs/core",
  "version": "0.1.0",
  "description": "JavaScript framework kernel for contract-driven routing, actions, and form metadata.",
  "license": "MIT",
  "homepage": "https://github.com/antistructured/potentiajs#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/antistructured/potentiajs.git"
  },
  "dist-tags": {
    "latest": "0.1.0",
    "preview": "0.1.0-preview.1"
  }
}
```

npm README check:

- README starts with `# PotentiaJS`
- README contains final install docs: `npm install @potentiajs/core`
- README includes ZeroVer caveat
- README includes no-JSX law
- README has no `0.1.0-preview` reference

npm installed package contents:

- installed file count: `56`
- examples ship intentionally: yes
- `docs/internal/`: absent
- `tests/`: absent
- generated `.potentia/`: absent

## JSR

JSR metadata from `https://jsr.io/@potentiajs/core/0.1.0_meta.json` confirms:

- version `0.1.0` metadata is reachable
- exports visible:
  - `.`
  - `./file-routing`
  - `./forms`
- manifest count: `36`
- examples excluded: yes
- CLI excluded: yes
- docs excluded: yes

## Artifact posture

Intentional posture after final publish:

- npm ships CLI and examples
- npm excludes internal docs, tests, and generated output
- JSR ships lean source/types/readme/license/package metadata
- JSR excludes examples, CLI, repo-only docs, tests, scripts, plugins, and generated output

## Issues

None release-blocking.

GitHub Actions emitted non-blocking setup-node warnings during publish; they did not affect registry publication or public usability.

## Blockers

None.
