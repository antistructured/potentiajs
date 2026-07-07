# Post-Release GitHub Release / Tag Audit

## Files inspected / commands run

- `package.json`
- `CHANGELOG.md`
- git tags
- tag object for `v0.1.0-preview.0`
- `gh release view v0.1.0-preview.0`
- `gh run list --limit 10`
- `git status --short`

## Git tag

Tag exists:

```txt
v0.1.0-preview.0
```

Tag points to commit:

```txt
7e35841af5a0dc08bdfaa1b94c4c3c43c27a5289
```

Current `HEAD`:

```txt
7e35841af5a0dc08bdfaa1b94c4c3c43c27a5289
```

Tag message:

```txt
PotentiaJS Public Preview Release v0.1.0-preview.0
```

Package version:

```txt
0.1.0-preview.0
```

Tag/version match: yes.

## GitHub release

GitHub release exists:

- name: `PotentiaJS v0.1.0-preview.0 Public Preview`
- tag: `v0.1.0-preview.0`
- prerelease: yes
- draft: no
- published: `2026-07-02T22:59:50Z`
- URL: `https://github.com/antistructured/potentiajs/releases/tag/v0.1.0-preview.0`

Release notes include:

- install command: `bun add @potentiajs/core`
- npm install command: `npm install @potentiajs/core`
- experimental API caveat
- included/deferred feature summary

## CI / workflow state

Recent GitHub Actions runs show failures:

| Workflow | Commit | Conclusion | URL |
| --- | --- | --- | --- |
| CI | `c350bf007af94868e6b5ebb69589d8ffbade6bcc` | failure | `https://github.com/antistructured/potentiajs/actions/runs/28626495660` |
| Publish | `c350bf007af94868e6b5ebb69589d8ffbade6bcc` | failure | `https://github.com/antistructured/potentiajs/actions/runs/28626495637` |
| CI | `7e35841af5a0dc08bdfaa1b94c4c3c43c27a5289` | failure | `https://github.com/antistructured/potentiajs/actions/runs/28626381687` |
| CI | `0a1b985ea64c426f930be41de9cf5ea826891b80` | failure | `https://github.com/antistructured/potentiajs/actions/runs/28625762945` |

This means the release tag/release exists, but CI/publish workflow state is not clean.

## Working tree

The working tree is dirty due to this post-release verification block:

- `README.md` updated for `@potentiajs/core` docs alignment
- `CHANGELOG.md` updated for `@potentiajs/core` docs alignment
- `package.json` duplicate `keywords` key removed
- post-release internal reports added

This is intentional verification/fix documentation work, but it means the repo has post-release changes not represented by the release tag.

## Issues found

- GitHub release/tag exists and matches package version.
- CI failed on release/tag-era commits.
- Publish workflow failed in recent run list.
- Registry package is not visible even though GitHub release exists.
- Local post-release fixes mean a follow-up commit or patch-release decision is needed.

## Blockers

- CI and Publish workflow failures need inspection/fix before announcing a clean release path.
- npm registry visibility remains blocked.
- JSR version visibility remains blocked.

## Publish status

No second publish occurred.
