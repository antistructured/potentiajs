# npm Publish Workflow Stabilization

## Files inspected

- `.github/workflows/publish.yml`
- `.github/workflows/publish-preview.yaml`
- `package.json`

## Files changed

- `.github/workflows/publish.yml`
- `.github/workflows/publish-preview.yaml`
- `docs/internal/npm-publish-workflow-stabilization.md`

## Changes

### Node version

Changed publish workflow Node setup from Node 24 to Node 22.

Applied to:

- verify job
- npm publish job
- JSR publish job

### setup-node version

Changed publish workflow setup-node action from `actions/setup-node@v6` to `actions/setup-node@v4`.

### npm latest upgrade

Removed:

```bash
npm install -g npm@latest
```

This avoids opting into newest npm provenance internals during first-publish stabilization.

### npm provenance disabled explicitly

Changed npm publish command to:

```bash
npm publish --access public --tag preview --provenance=false
```

and set:

```yaml
env:
  NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
  NPM_CONFIG_PROVENANCE: "false"
```

### preview dry-run provenance disabled

Changed preview dry-run command to:

```bash
npm publish --dry-run --tag preview --provenance=false
```

and set:

```yaml
env:
  NPM_CONFIG_PROVENANCE: "false"
```

## Package metadata preserved / clarified

Kept public scoped access and added an explicit preview dist-tag for the prerelease package:

```json
"publishConfig": {
  "access": "public",
  "tag": "preview"
}
```

Repository metadata was not removed.

## Expected behavior

The npm publish job should no longer intentionally enter provenance mode for token-based first publish.

## Publish status

No real publish was run locally.

## Blockers

Real npm publish still requires a valid `NPM_TOKEN` secret or an explicitly chosen trusted-publishing flow in a later hardening pass.
