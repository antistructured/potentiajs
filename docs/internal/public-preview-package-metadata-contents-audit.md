# Public Preview Package Metadata / Contents Audit

## Files inspected

- `package.json`
- `README.md`
- `npm pack --dry-run --json` output at `/tmp/potentia-regate-pack.json`
- package source tree
- examples allowlist
- generated/internal/test artifact exclusions

## Files changed

- `docs/internal/public-preview-package-metadata-contents-audit.md`

## Pack command

```bash
npm pack --dry-run --json
```

Result: pass.

## Metadata audit

| Field | Current value | Decision |
| --- | --- | --- |
| name | `potentia-js` | Keep unchanged for re-gate. |
| version | `0.0.1` | Keep unchanged. Future preview target remains `0.0.2-preview.0`. |
| private | `true` | Keep until explicit publish prep. |
| license | `UNLICENSED` | Accurate because no root license decision/file exists. |
| description | `Experimental, contract-driven JavaScript framework kernel.` | Accurate enough, though it may need broader action/forms wording before publish. |
| type | `module` | Correct for plain JavaScript ESM. |
| main/module | `./src/index.js` | Correct package entrypoint. |
| exports | `{ ".": "./src/index.js" }` | Correct minimal root export. |
| engines | `{ "bun": ">=1.3.0" }` | Correct Bun-first posture. |
| dependencies | `@weipertda/sigiljs@0.18.0` | Expected single runtime dependency. |
| devDependencies | `{}` | No dev dependencies. |

## Files allowlist

Package allowlist includes:

- `src/index.js`
- `src/kernel/`
- `examples/kernel-basic/`
- `examples/sigiljs-basic/`
- `examples/composed-basic/`
- `examples/action-basic/`
- `examples/form-state-basic/`
- `README.md`

This matches current public-preview evidence: source, README, and intentional examples ship; internal docs and tests stay repo-only.

## Packed artifact contents

Dry-run summary:

- entry count: `37`
- unpacked size: `101457`

Included examples:

- `examples/kernel-basic/`
- `examples/sigiljs-basic/`
- `examples/composed-basic/`
- `examples/action-basic/`
- `examples/form-state-basic/`

Excluded successfully:

- `docs/internal/`
- `tests/`
- `.potentia/`
- editor/history artifacts
- `examples/file-routing-dev/`
- `examples/UserProfile.view`

## Decisions

- Version should remain `0.0.1` during this re-gate.
- Future preview target should remain `0.0.2-preview.0` if publish prep happens later.
- Package should remain private until license/repository/npm intent are resolved.
- `UNLICENSED` is still accurate.
- Examples are intentionally shipped, except internal file-routing/dev artifacts.
- Package entrypoint is correct.

## Publish blockers

- package remains private
- no root `LICENSE` file
- repository/bugs/homepage metadata absent
- CI workflow absent
- no npm/JSR publish intent confirmed
- all APIs experimental
- public export pruning decision unresolved

## Blockers

No package-contents cleanliness blocker was found. Registry readiness remains blocked by metadata/intent/API-stability decisions rather than accidental package contents.
