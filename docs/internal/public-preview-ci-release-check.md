# Public Preview CI / Release Check

## Files inspected

- `package.json`
- `.github/workflows/`
- `bun.lock`
- `README.md`
- `docs/internal/public-preview-version-publish-config-decision.md`

## Files changed

- `package.json`
- `.github/workflows/ci.yaml`
- `README.md`
- `docs/internal/public-preview-ci-release-check.md`

## Scripts updated

Added package script:

```json
{
  "check:release": "bun run check:preview"
}
```

This keeps release verification aligned with the current preview check without inventing a new release pipeline.

## Workflow

Added `.github/workflows/ci.yaml`.

Workflow behavior:

- runs on pushes to `main`
- runs on pull requests
- checks out the repository
- installs Bun via `oven-sh/setup-bun@v2`
- runs `bun install --frozen-lockfile` because `bun.lock` exists
- runs `bun run check:release`
- runs `npm pack --dry-run --json`

## Publish safety

The workflow does not:

- publish to npm
- publish to JSR
- use npm tokens
- use JSR tokens
- create releases
- tag commits

## Blockers

No CI/release-check mechanical blocker remains. Release check exists and CI is added, but final publish is still blocked by license/package visibility/npm access decisions.
