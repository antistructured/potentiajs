# Final Release Publish Workflow Prep

## Files inspected

- `.github/workflows/ci.yaml`
- `package.json`
- `README.md`
- `docs/internal/owner-npm-publish-path-decision.md`
- `docs/internal/final-release-package-identity-metadata.md`

## Files changed

- `.github/workflows/publish-preview.yaml`
- `docs/internal/final-release-publish-workflow-prep.md`

## Workflow behavior

Created manual-only workflow:

```txt
.github/workflows/publish-preview.yaml
```

Trigger:

```yaml
workflow_dispatch
```

The workflow requires the manual input:

```txt
DRY-RUN
```

It runs:

- checkout
- setup Bun
- `bun install --frozen-lockfile`
- `bun run check:release`
- `npm pack --dry-run --json`
- `npm publish --dry-run --tag preview`

## Real publish posture

Real publish is intentionally not enabled in this workflow.

The workflow contains comments describing the later enablement path, but no real publish step exists. A future real publish job should be added only after:

- explicit owner command to publish
- protected GitHub environment decision
- npm trusted publishing or `NPM_TOKEN` configuration
- final dry-run is green

## Secrets

No secret is required for normal CI or the dry-run workflow.

`NPM_TOKEN` is not referenced by the workflow.

## Blockers

No workflow blocker remains for dry-run release prep.

Remaining external blocker:

- actual CI publishing requires future trusted publishing or npm token setup.

## Publish status

Real publish was not run.
