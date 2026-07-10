# Registry Hygiene Patch Preview Version Decision

## Options considered

### Option A — No patch preview

Proceed directly to:

```txt
0.1.0 Release Prep Pass
```

Use if hygiene issues are acceptable until final.

### Option B — Prepare `0.1.0-preview.1`

Use if registry artifact/tag hygiene should be rehearsed before final.

Potential changes:

- JSR artifact include/exclude tightening
- npm dist-tag workflow/post-publish verification posture
- changelog hygiene
- package metadata cleanup if needed
- no framework source/API changes

### Option C — Patch workflow only, no version bump

Use if only workflow comments/checks are needed and no registry artifact correction is desired.

## Decision

Prepare `0.1.0-preview.1` as a hygiene patch if the implementation pass changes `jsr.json` package contents or publish metadata.

## Rationale

The public package is usable, but one finding affects the actual published JSR artifact shape:

```txt
JSR artifact contents appear broader than intended.
```

A JSR artifact content change cannot be proven to users without a new JSR version. Therefore, if the implementation pass tightens `jsr.json`, a new preview package is warranted.

A tiny `0.1.0-preview.1` also provides a clean final release rehearsal:

- verifies workflow after npm/JSR fixes
- proves npm preview dist-tag behavior intentionally
- proves JSR lean artifact behavior before final
- avoids carrying known registry hygiene issues into `0.1.0`

## Version target

Recommended target:

```txt
0.1.0-preview.1
```

## No version bump in this pass

This planning pass does not edit:

- `package.json` version
- `jsr.json` version
- `CHANGELOG.md`

The version bump belongs in the follow-up implementation pass if accepted.

## If implementation finds no config/package changes are needed

If the next pass determines only docs/workflow comments are needed, do not cut `0.1.0-preview.1`; use Option C instead.

## Blockers

Implementation must first verify the correct current JSR include/exclude schema and dry-run manifest behavior.
