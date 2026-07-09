# JSR Publish Workflow Stabilization

## Files inspected

- `.github/workflows/publish.yml`
- `jsr.json`
- `package.json`

## Files changed

- `.github/workflows/publish.yml`
- `docs/internal/jsr-publish-workflow-stabilization.md`

## Workflow command

The JSR publish command remains:

```bash
npx jsr publish
```

## Workflow stabilization

The publish workflow now uses Node 22 via `actions/setup-node@v4` for the JSR publish job. This keeps publish tooling conservative and aligned with the npm stabilization pass.

## Config stabilization

`jsr.json` uses JSR-compatible string exports:

```json
{
  ".": "./src/index.js",
  "./file-routing": "./src/file-routing.js",
  "./forms": "./src/forms.js"
}
```

No npm-style conditional exports remain in JSR config.

## Test/check ordering

The JSR publish job depends on the shared `verify` job:

```txt
publish-jsr needs verify
```

The `verify` job runs:

- package/JSR version parity check
- `bun install --frozen-lockfile`
- `bun run check:release`

## Generated output posture

`jsr.json` excludes generated `.potentia/` output:

```json
"examples/**/.potentia"
```

## Permissions

Workflow top-level permissions include:

```yaml
id-token: write
```

This remains available for JSR/OIDC publishing.

## Publish status

No real JSR publish was run locally.

## Blockers

No JSR config parse blocker remains in the current tree.

Actual JSR publishing still depends on registry authorization/OIDC/project setup at workflow runtime.
