# Package Metadata Preview Audit

## Files inspected

- `package.json`
- `README.md`
- root `LICENSE` lookup
- package files allowlist
- `npm pack --dry-run --json` output

## Metadata changes made

Updated `package.json` to make private-preview metadata coherent:

- Kept `name: potentia-js`.
- Kept `version: 0.0.1`.
- Kept `private: true`.
- Replaced stale description with: `Experimental Bun-first contract-driven JavaScript framework kernel.`
- Kept `type: module`.
- Kept `main`, `module`, and `exports["."]` pointed at `./src/index.js`.
- Kept the package files allowlist for source, examples, README, and docs.
- Replaced placeholder keywords with Bun/framework/contracts/SigilJS/routing terms.
- Kept `author: Daniel Weipert`.
- Changed `license` from `MIT` to `UNLICENSED` because no root `LICENSE` file exists and this block does not decide a public license.
- Removed placeholder `repository.url: ""`.
- Removed placeholder `bugs.url: "https://"`.
- Added `engines.bun: >=1.3.0`.
- Kept runtime dependency list intentional: `@weipertda/sigiljs@0.18.0`.
- Kept `devDependencies` empty.

## Metadata field audit

| Field | Status | Notes |
| --- | --- | --- |
| `name` | coherent | `potentia-js`; no rename evidence. |
| `version` | coherent for private gate | Remains `0.0.1`; target `0.0.2-preview.0` documented for later publish prep. |
| `private` | intentional | Remains `true`; no registry publish in this block. |
| `description` | repaired | Now describes current kernel truthfully. |
| `type` | correct | ESM package. |
| `main` | correct | `./src/index.js` exists. |
| `module` | correct | `./src/index.js` exists. |
| `exports` | correct | Root package export resolves. |
| `files` | acceptable for now | Includes source/examples/docs; internal docs shipping is revisited in package readiness. |
| `scripts` | minimal | `test`, `check`, `pack:dry` exist; preview script handled in release scripts pass. |
| `keywords` | repaired | Matches current Bun/framework/contracts posture. |
| `author` | present | Kept existing author. |
| `license` | repaired | `UNLICENSED` until owner chooses license and adds license file. |
| `repository` | removed | No Git repository or URL to assert. |
| `bugs` | removed | Placeholder URL removed. |
| `homepage` | absent | Correct until real URL exists. |
| `engines` | added | Documents Bun-first runtime target. |
| `dependencies` | intentional | Only SigilJS runtime dependency. |
| `devDependencies` | intentional | Empty; no lint/TS tooling added. |

## Pack check

Command run:

```bash
npm pack --dry-run --json
```

Result:

- package name: `potentia-js`
- version: `0.0.1`
- entry count: `58`
- dry run exited successfully

## Blockers

- Package remains private.
- No root license file exists.
- No repository, bugs, or homepage URLs can be honestly added from this checkout.
- Public-preview version bump is deferred to publish prep.
- Internal docs currently ship via `docs/` allowlist; package readiness pass must decide whether that is intentional.
