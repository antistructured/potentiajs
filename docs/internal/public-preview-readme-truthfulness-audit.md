# Public Preview README / Docs Truthfulness Audit

## Files inspected

- `README.md`
- `package.json`
- `examples/kernel-basic/README.md`
- `examples/sigiljs-basic/README.md`
- `examples/composed-basic/README.md`
- `examples/action-basic/README.md`
- `examples/form-state-basic/README.md`
- targeted markdown search for production/stability/publish/form/client/OpenAPI claims

## Files changed

- `README.md`
- `docs/internal/public-preview-readme-truthfulness-audit.md`

## Truthfulness fixes

Updated the README public API status list to include the new experimental `projectForm` export.

## README posture audit

The README is appropriately restrained:

- states Potentia is experimental
- states it is not production-ready
- states there is no stable public API
- states the package is private
- states license metadata is `UNLICENSED`
- documents Bun as the runtime
- documents plain JavaScript ES modules and no TypeScript source
- documents the SigilJS runtime dependency
- says local checkout/packed-artifact experiments only, not npm-ready install
- clearly lists current limitations and registry blockers

## Capability truthfulness audit

No false implemented claims were found for:

- production readiness
- stable public API
- frontend runtime
- form renderer/generator
- client SDK
- OpenAPI
- CLI/compiler
- DB/auth
- file-routing public API
- package split

The README correctly distinguishes:

- internal/dev-only file-routing projection from stable file routing
- projection metadata from generators
- `createFormState(...)` from automatic form/session behavior
- `projectForm(...)` from renderer/form generation
- server-authoritative validation from future client convenience

## Example README audit

Example READMEs are generally honest:

- `kernel-basic`: notes source-relative imports and no frontend/CLI/compiler/database/auth behavior.
- `sigiljs-basic`: focused on contract boundaries and notes no frontend/file-routing/CLI/compiler/database/auth behavior.
- `composed-basic`: explains explicit route composition and plugin seam limits.
- `action-basic`: accurately describes action input/redirect/domain failure and says no frontend/client SDK/OpenAPI/multipart behavior is implemented in that example.
- `form-state-basic`: accurately describes `createFormState(...)`, `projectForm(...)` metadata, sensitive omission, and no renderer/generator/client/OpenAPI behavior.

## Remaining risks

- README is dense for a future public preview. It is truthful but may need a shorter public-preview landing page before publish prep.
- Registry blockers section still needed a fresh packed-artifact smoke at the time of this pass; that is handled in Pass 6.
- All APIs are marked experimental, but individual source-level JSDoc annotations are not comprehensive. This is acceptable for this re-gate but should be considered in an API stabilization pass.

## Blockers

No README truthfulness issue blocks continued readiness work. The main documentation risk is presentation/length, not false capability claims.
