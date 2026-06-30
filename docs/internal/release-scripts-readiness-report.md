# Release Scripts Readiness Report

## Files inspected

- `package.json`
- `.github/workflows/` lookup
- `tests/`
- `README.md`
- `docs/internal/`

## Files changed

- `package.json`
- `docs/internal/ci-readiness-plan.md`
- `docs/internal/release-scripts-readiness-report.md`

## Work completed

Added a dependency-free local preview check script:

```json
"check:preview": "bun run test && bun run check && npm pack --dry-run --json"
```

Existing scripts remain:

```json
"test": "bun test",
"check": "bun test",
"pack:dry": "npm pack --dry-run --json"
```

No lint, TypeScript, build, or publish scripts were added.

## CI decision

Created `docs/internal/ci-readiness-plan.md` instead of adding `.github/workflows/preview-check.yml`.

Reason:

- No Git repository exists at this path.
- No GitHub remote or branch context is known.
- Adding a workflow now could imply CI is configured when it is not.

The readiness plan includes a safe future GitHub Actions workflow using Bun setup and `bun run check:preview`, with no publish step and no secrets.

## Publish boundary

No publish automation was added. Registry publishing remains a human decision for a follow-up publish-prep block.

## Blockers

- No Git repository detected.
- No CI is actually configured yet.
- No public package/license/repository decision yet.
