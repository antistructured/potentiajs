# Post-Release Automation Hardening Audit

## Files inspected

- `.github/workflows/ci.yaml`
- `.github/workflows/publish-preview.yaml`
- GitHub workflow list
- recent GitHub Actions run list
- failed Publish workflow logs
- failed CI workflow logs
- `package.json` scripts
- `docs/internal/final-release-publish-workflow-prep.md`

## npm automation

### Current workflows visible on GitHub

```txt
CI
Publish Preview Prep
Publish
```

Local workflow files in this checkout:

- `.github/workflows/ci.yaml`
- `.github/workflows/publish-preview.yaml`

The remote GitHub workflow list also shows a `Publish` workflow that is not present in the current local workflow files inspected here, or exists in a post-commit state not represented by the current working tree snapshot.

### CI workflow

Current `.github/workflows/ci.yaml`:

- triggers on push to `main` and pull requests
- installs with `bun install --frozen-lockfile`
- runs `bun run check:release`
- runs `npm pack --dry-run --json`
- does not publish
- does not use secrets

### Publish Preview Prep workflow

Current `.github/workflows/publish-preview.yaml`:

- manual-only `workflow_dispatch`
- requires input `DRY-RUN`
- installs with frozen lockfile
- runs `bun run check:release`
- runs `npm pack --dry-run --json`
- runs `npm publish --dry-run --tag preview`
- has no real publish step
- has no `NPM_TOKEN`

This workflow is safe as a dry-run workflow.

### Publish workflow failure evidence

Recent remote `Publish` workflow failed before publishing because `bun run check:release` failed.

Relevant failure:

```txt
error: Cannot find package 'potentiajs' from tests/fixtures/file-routing-app/.potentia/routes.generated.js
2 tests failed
555 pass
2 fail
error: script "check:release" exited with code 1
```

Interpretation: remote release automation ran against a commit where file-routing generated-smoke tests still expected/generated the old `potentiajs` package name while the release package identity had moved to `@potentiajs/core`. This likely blocked the actual npm publish step.

## JSR automation

JSR package shell exists:

```txt
@potentiajs/core
```

JSR API shows:

- GitHub repo linked: `antistructured/potentiajs`
- version count: `0`
- latest version: `null`

JSR hardening requirements before a real JSR publish:

- package must have versioned JSR release, not just package shell
- JSR package settings should remain linked to GitHub repo
- GitHub Actions publishing should use OIDC/tokenless publishing where possible
- workflow permissions may need `id-token: write`
- command path should use `jsr publish` / `deno publish` only in a dedicated JSR workflow
- no long-lived JSR secret if tokenless publishing is available

## Recommended npm hardening

- Fix CI package identity mismatch to `@potentiajs/core` before any publish retry.
- Use npm Trusted Publishing / provenance if available instead of long-lived `NPM_TOKEN`.
- If a token is required, place it behind a protected GitHub Environment.
- Keep preview release workflow manual, not push-triggered.
- Require `bun run check:release` before publish.
- Require `npm pack --dry-run --json` before publish.
- Require `npm publish --dry-run --tag preview` before publish.
- Add a tag/version guard: `package.json` version must equal the git tag without leading `v`.
- Add a package-name guard: `package.json` name must equal `@potentiajs/core`.
- Add a registry visibility check after publish.
- Never publish on every push.

## Recommended JSR hardening

- Run a dedicated JSR Compatibility / Automation Hardening block.
- Decide whether JSR publish should be tied to npm publish or separate.
- Add `id-token: write` only to the JSR publish job if tokenless publishing requires it.
- Verify exports/docs/types against JSR expectations before enabling publish.
- Verify a versioned JSR artifact after publish.

## Blockers

- Remote CI/Publish workflows currently failed.
- npm package is not visible, likely because publish was blocked or failed.
- JSR package has no visible version.
- Local post-release docs/package fixes need to be committed before rerunning release automation.

## Publish status

No second publish occurred.
