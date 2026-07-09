# npm / JSR Publish Failure Scope Lock

## Files inspected

- `package.json`
- `jsr.json`
- `.npmrc` search result
- `.github/workflows/ci.yaml`
- `.github/workflows/publish-preview.yaml`
- `.github/workflows/publish.yml`
- `docs/internal/*publish*`
- `docs/internal/*release*`

## Failures scoped separately

### npm failure

Observed remote failure:

```txt
npm error code MODULE_NOT_FOUND
npm error Cannot find module 'sigstore'
npm error Require stack:
- npm/node_modules/libnpmpublish/lib/provenance.js
```

Interpretation:

```txt
npm publish is entering npm provenance internals.
```

This is a npm/toolchain/provenance path, not PotentiaJS framework package code.

### JSR failure

Observed remote failure:

```txt
Failed to parse exports at jsr.json
The path of the '.' export must be a string,
found invalid value '{"types":"./src/index.d.ts","import":"./src/index.js"}'.
Exports in deno.json do not support conditional exports.
```

Interpretation:

```txt
JSR config cannot use npm-style conditional exports.
```

This is a registry config shape issue, not framework runtime code.

## Scope

In scope:

- npm publish workflow toolchain/provenance stabilization
- JSR export shape verification/fix
- safe dry-run publish checks
- internal documentation of root causes and commands

Out of scope:

- framework API changes
- renderer changes
- file-routing behavior changes
- version bump
- real publish
- repository/tag/release creation

## Real publish posture

No real publish command is allowed in this pass unless explicitly approved by the owner.

## Acceptance

Scope is locked and npm/JSR failures are treated independently.

## Blockers

None.
