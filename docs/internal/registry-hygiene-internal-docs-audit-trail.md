# Registry Hygiene Internal Docs Audit Trail

## Commands run

```bash
git status --short
npm pack --dry-run --json
```

## Docs confirmed

Post-publish verification docs exist:

- `docs/internal/post-publish-registry-verification-scope-lock.md`
- `docs/internal/post-publish-npm-registry-visibility.md`
- `docs/internal/post-publish-jsr-registry-visibility.md`
- `docs/internal/post-publish-fresh-npm-install-smoke.md`
- `docs/internal/post-publish-public-import-surface-smoke.md`
- `docs/internal/post-publish-public-cli-smoke.md`
- `docs/internal/post-publish-registry-metadata-docs-check.md`
- `docs/internal/post-publish-registry-verification-report.md`

Registry hygiene planning docs exist:

- `docs/internal/registry-hygiene-planning-scope-lock.md`
- `docs/internal/registry-hygiene-npm-dist-tag-decision.md`
- `docs/internal/registry-hygiene-jsr-artifact-decision.md`
- `docs/internal/registry-hygiene-internal-docs-tracking-decision.md`
- `docs/internal/registry-hygiene-patch-preview-version-decision.md`
- `docs/internal/registry-hygiene-planning-report.md`
- `docs/internal/registry-hygiene-planning-final-verification.md`

Registry hygiene implementation docs created so far:

- `docs/internal/registry-hygiene-implementation-scope-lock.md`
- `docs/internal/registry-hygiene-jsr-schema-verification.md`
- `docs/internal/registry-hygiene-jsr-include-exclude-patch.md`
- `docs/internal/registry-hygiene-jsr-artifact-dry-run.md`
- `docs/internal/registry-hygiene-npm-dist-tag-workflow-patch.md`
- `docs/internal/registry-hygiene-internal-docs-audit-trail.md`

## Pack exclusion

`npm pack --dry-run --json` result:

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 56
```

Confirmed absent from npm package:

- `docs/internal/`
- `tests/`
- generated `.potentia/`

## Working tree notes

Working tree contains intended hygiene implementation changes:

- `.github/workflows/publish.yml`
- `jsr.json`
- internal audit docs under `docs/internal/`

## Blockers

None.
