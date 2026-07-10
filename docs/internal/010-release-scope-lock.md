# 0.1.0 Release Scope Lock

## Files inspected

- `package.json`
- `jsr.json`
- `README.md`
- `CHANGELOG.md`
- `.github/workflows/publish.yml`
- `docs/internal/*preview*`
- `docs/internal/*registry*`
- `src/index.js`
- `src/file-routing.js`
- `src/forms.js`
- `examples/`
- git status

## 0.1.0 meaning under ZeroVer

`0.1.0` means PotentiaJS has its first serious public foundation:

- usable
- documented
- externally installable
- verified through npm and JSR preview releases
- still experimental under ZeroVer
- still allowed to evolve before a future `1.0.0`

It does **not** mean:

- API permanence
- production guarantee
- complete framework surface
- `1.0.0`
- React/JSX alternative positioning

## Included

Public package identity:

- npm: `@potentiajs/core`
- JSR: `@potentiajs/core`
- CLI: `potentia`

Public package root:

- core application kernel
- route declarations and route collections
- contract/action/route/form projection helpers
- action helpers
- form state helper
- explicit effect helpers
- response/result helpers

Public subpaths:

- `@potentiajs/core/file-routing`
- `@potentiajs/core/forms`

Public CLI:

- `potentia routes generate`
- `potentia routes check`
- `--json` mode for both commands

Public examples intentionally shipped to npm:

- `examples/file-routing-basic/`
- `examples/form-rendering-basic/`
- `examples/full-flow-basic/`

## Excluded

Out of scope for `0.1.0` release prep:

- framework feature additions
- renderer behavior changes
- file-routing behavior changes
- root API expansion
- JSX
- hydration-first identity
- React-like framework identity
- compiler/template syntax
- production-ready claim
- API permanence claim
- DB/auth integrations
- client SDK
- OpenAPI generator
- new examples beyond release docs touch-ups

## Architectural laws

Release prep preserves:

- plain JavaScript
- Bun-first runtime posture
- contract-native routing/actions
- server-first design
- HTML-first/progressive-enhancement posture
- no JSX as official direction
- SigilJS runtime contracts
- functional core / imperative shell
- explicit effects

## Export boundaries

Root must not export:

- `generateFileRoutes`
- `renderForm`
- CLI internals
- dev internals

Subpaths hold optional public surfaces:

- file-routing generation via `@potentiajs/core/file-routing`
- server-side form HTML rendering via `@potentiajs/core/forms`

## Churn policy

No source/API churn unless a real release blocker is found.

## Blockers

None at scope-lock time.
