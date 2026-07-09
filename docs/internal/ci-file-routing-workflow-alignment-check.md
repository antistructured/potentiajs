# CI File Routing Workflow Alignment Check

## Files inspected

- `.github/workflows/ci.yaml`
- `.github/workflows/publish-preview.yaml`
- `.github/workflows/publish.yml`
- `package.json`
- `jsr.json`

## Workflow commands

Active workflows run release verification through:

```bash
bun install --frozen-lockfile
bun run check:release
```

`ci.yaml` and `publish-preview.yaml` additionally run:

```bash
npm pack --dry-run --json
```

`publish.yml` verify job also checks package/JSR version parity before running `bun run check:release`.

## Local script chain

`package.json` defines:

```json
{
  "test": "bun test",
  "check": "bun test",
  "check:preview": "bun run test && bun run check && npm pack --dry-run --json",
  "check:release": "bun run check:preview"
}
```

So workflow `bun run check:release` executes the intended test + preview + pack chain.

## Branch/ref alignment

- `ci.yaml` runs on `push` to `main` and `pull_request`.
- `publish.yml` runs on `push` to `main` and `workflow_dispatch`.
- `publish-preview.yaml` runs on manual `workflow_dispatch`.
- No workflow pins an old checkout ref.

## Cache alignment

- `publish.yml` explicitly sets `package-manager-cache: false` for Node setup.
- `ci.yaml` / `publish-preview.yaml` do not configure dependency cache.
- No GitHub cache key appears likely to preserve stale generated output.

## Package manager alignment

All inspected workflows install with:

```bash
bun install --frozen-lockfile
```

and use Bun for release checks. This aligns with local verification.

## Version parity

`package.json` and `jsr.json` both report:

```txt
0.1.0-preview.0
```

The `publish.yml` version parity check should pass for the current tree.

## Workflow-only risk

No workflow-only issue was found that explains the historical two file-routing failures, aside from the likely remote run using an older commit before package identity/test alignment landed.

If GitHub reruns still show the old `555 pass / 2 fail / 1161 expect()` counts, rerun against the current branch tip and clear any workflow run selection ambiguity. Cache clearing is not expected to be necessary because no dependency/generated-output cache is configured.

## Blockers

None.
