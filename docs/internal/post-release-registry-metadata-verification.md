# Post-Release Registry Metadata Verification

## npm

Registry used:

```txt
https://registry.npmjs.org/
```

Commands run:

```bash
npm view @potentiajs/core name version license repository homepage bugs dist.tarball keywords dependencies --json
npm view @potentiajs/core@0.1.0-preview.0 name version license repository homepage bugs dist.tarball keywords dependencies --json
npm view potentiajs name version license repository homepage bugs dist.tarball keywords dependencies --json
npm view potentiajs@0.1.0-preview.0 name version license repository homepage bugs dist.tarball keywords dependencies --json
npm search potentiajs --json
```

Results:

| Package | Visible | Version | Notes |
| --- | --- | --- | --- |
| `@potentiajs/core` | no | unavailable | npm returned `E404 Not Found`. |
| `@potentiajs/core@0.1.0-preview.0` | no | unavailable | npm returned `E404 Not Found`. |
| `potentiajs` | no | unavailable | npm returned `E404 Not Found`. |
| `potentiajs@0.1.0-preview.0` | no | unavailable | npm returned `E404 Not Found`. |
| npm search `potentiajs` | no results | unavailable | search returned `[]`. |

npm metadata audit:

- visible: no
- version: not visible
- license: not visible
- repository: not visible
- homepage: not visible
- bugs: not visible
- README: not visible
- dist tarball: not visible
- dependency list: not visible
- public package: not verified

## JSR

Commands run:

```bash
curl -L https://jsr.io/@potentiajs/core
curl -L https://api.jsr.io/scopes/potentiajs/packages/core
curl -L https://jsr.io/@weipertda/potentiajs
curl -L https://api.jsr.io/scopes/weipertda/packages/potentiajs
```

Results:

### `@potentiajs/core`

- package page HTTP status: `200`
- page title: `@potentiajs/core - JSR`
- API scope: `potentiajs`
- API name: `core`
- description: `An experimental Bun-first JavaScript framework kernel for explicit, contract-driven request handling`
- GitHub repository: `antistructured/potentiajs`
- runtime compatibility shown by API: browser, deno, node, workerd, bun
- readme source: `readme`
- version count: `0`
- latest version: `null`
- score: `null`

Interpretation: the JSR package shell exists and is linked to GitHub metadata, but no released version is visible through the JSR API.

### `@weipertda/potentiajs`

- package page HTTP status: `404`
- API result: `packageNotFound`

## Issues

- npm publish is not visible for either likely final package identity.
- JSR package exists as `@potentiajs/core`, but has no visible version; it is not usable as a published version yet.
- Local `package.json` currently says `@potentiajs/core`, while `README.md` still says `potentiajs`; this local docs/package identity mismatch should be fixed before another publish attempt.

## Blockers

Registry presence is blocked:

- npm: package not found
- JSR: package shell found, no version found

Because the published version is not visible, real registry install smoke cannot truthfully pass yet.

## Publish status

No second publish occurred.
