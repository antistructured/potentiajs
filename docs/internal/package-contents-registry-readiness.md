# Package Contents / Registry Readiness

## Files inspected

- `package.json`
- `README.md`
- package files allowlist
- `npm pack --dry-run --json` output
- `docs/internal/`
- `examples/`

## Files changed

- `package.json`
- `docs/internal/package-contents-registry-readiness.md`

## Package contents decision

Removed `docs/` from the package files allowlist.

Reason:

- Current docs are internal audit reports, not polished package-consumer docs.
- README and example READMEs are the public package documentation for this preview gate.
- Internal reports remain repository evidence and should not ship as registry package contents.

## npm pack dry-run

Command run:

```bash
npm pack --dry-run --json
```

Result:

- package name: `potentia-js`
- version: `0.0.1`
- entry count: `23`
- dry run exited successfully

Included intended files:

- `README.md`
- `package.json`
- `src/index.js`
- `src/kernel/`
- `examples/kernel-basic/`
- `examples/sigiljs-basic/`
- `examples/composed-basic/`

Excluded unintended files:

- `.history/`
- `.idea/`
- `.vscode/`
- `src/index.mjs`
- `docs/internal/`
- `examples/UserProfile.view`
- editor metadata
- test output artifacts

## Registry readiness posture

### npm

Status: **not ready** for publishing from this block.

Reasons:

- Package remains `private: true`.
- Root `LICENSE` file is absent.
- Package license is intentionally `UNLICENSED` until owner chooses a license.
- Repository, bugs, and homepage metadata are absent.
- No Git repository was detected at this path.
- Public API is experimental and should be previewed deliberately.
- Fresh install-from-packed-artifact smoke remains for publish prep.

The package is clean enough for local `npm pack --dry-run` validation and a later publish-prep decision.

### JSR

Status: **deferred**.

Reasons:

- No `jsr.json` exists.
- The package is Bun-first and examples use `Bun.serve()`.
- API volatility is still high.
- No TypeScript declarations or JSR-oriented docs are present.
- JSR should wait until npm/GitHub preview posture and public API boundaries are clearer.

## Blockers

- Missing root license file.
- Missing real repository metadata.
- Private package flag remains enabled.
- No Git repository detected.
- No registry publish occurred.
