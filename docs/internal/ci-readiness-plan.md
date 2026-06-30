# CI Readiness Plan

## Decision

Do not add `.github/workflows/preview-check.yml` in this block.

Reason:

- No Git repository was detected at this path.
- Repository owner/remote/default branch are unknown.
- The block is a preview readiness gate, not a GitHub publishing/setup block.
- Adding workflow files without repository context could imply CI is configured when it is not.

## Minimal future workflow

When the project is in a real GitHub repository, add a non-publishing workflow that:

- checks out the repository
- installs Bun
- runs `bun install --frozen-lockfile`
- runs `bun run check:preview`
- does not publish
- requires no secrets

Suggested future workflow shape:

```yaml
name: Preview Check

on:
  push:
  pull_request:

jobs:
  preview-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run check:preview
```

## Current local gate

Use:

```bash
bun run check:preview
```

This runs tests/checks and an npm pack dry run without publishing.

## Publish boundary

No publish automation should be added until:

- package is intentionally public
- license is decided and present
- repository metadata is real
- npm identity/access/2FA are confirmed by the owner
- package version target is intentionally bumped
