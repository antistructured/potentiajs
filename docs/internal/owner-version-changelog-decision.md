# Owner Version / Changelog Decision

## Current version

```txt
0.0.1
```

## Git history reference

Current committed history count observed during decision follow-up:

```txt
3 commits
```

Current HEAD:

```txt
0238e8e
```

Commit count should not directly determine package version. SemVer should communicate package/API maturity, not repository commit count.

## Owner direction

- Stay in `0.x.x` versioning.
- Choose an actual/approximate preview version that reflects package maturity.
- Do not use `1.0.0`.

## Recommended preview target

Decision recommendation: **`0.1.0-preview.0`**.

Reason:

- Potentia has moved beyond a one-patch `0.0.1` baseline.
- Current surface includes routing, composition, SigilJS contracts, effects, actions, diagnostics, form state/projection, route/action metadata, manifests, examples, package smoke, CI, and API pruning.
- `0.1.0-preview.0` signals the first coherent public preview while remaining clearly pre-1.0 and experimental.
- It avoids misleading commit-count-derived versions such as `0.0.3`.

Alternative if the owner wants ultra-conservative numbering:

```txt
0.0.2-preview.0
```

## Current changelog state

- Internal release notes exist: `docs/internal/public-preview-release-notes.md`
- Internal changelog prep exists: `docs/internal/public-preview-changelog-prep.md`
- Root `CHANGELOG.md`: absent

## Changelog decision recommendation

Best option for PotentiaJS public preview:

```txt
Create root CHANGELOG.md during Final Public Preview Release Prep
```

Reason:

- npm users expect a public changelog.
- release notes are already drafted internally.
- root changelog should be created when license/package/version decisions are applied so it matches final metadata.

## Future changes

During Final Public Preview Release Prep:

1. Update `package.json` version to `0.1.0-preview.0`, unless owner chooses the conservative fallback.
2. Update README current status and projection examples that mention `0.0.1` where appropriate.
3. Create root `CHANGELOG.md` with the chosen preview version section.
4. Rerun packed artifact smoke.

## Blocked changes in this decision-capture block

- No version bump here.
- No root `CHANGELOG.md` created here.
- No release claim added here.
