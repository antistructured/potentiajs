# npm Provenance / Node Toolchain Audit

## Files inspected

- `package.json`
- `.npmrc` search result
- `.github/workflows/ci.yaml`
- `.github/workflows/publish-preview.yaml`
- `.github/workflows/publish.yml`

## Search terms

- `provenance`
- `NPM_CONFIG_PROVENANCE`
- `publishConfig`
- `id-token`
- `node-version`
- `npm publish`

## Findings before stabilization

### `publishConfig.provenance`

Not present.

`package.json` contains only:

```json
"publishConfig": {
  "access": "public"
}
```

After stabilization, `publishConfig.tag: "preview"` was added for the prerelease package while keeping `access: "public"`.

### `.npmrc provenance=true`

No `.npmrc` file was found in the repository.

### Workflow `NPM_CONFIG_PROVENANCE`

Not present before stabilization.

### Node version used by publish job

Before stabilization, `.github/workflows/publish.yml` used:

```txt
node-version: "24"
```

for verify, npm publish, and JSR publish jobs.

### npm version behavior

Before stabilization, npm publish job included:

```bash
npm install -g npm@latest
```

This could move the job onto the newest npm provenance path independently of the Node runner.

### `id-token: write`

Present at workflow top level:

```yaml
permissions:
  contents: read
  id-token: write
```

This can be appropriate for JSR/OIDC publishing, but it also means provenance/trusted-publishing posture must be explicit for npm.

### Token vs trusted publishing

The npm publish job did not set `NODE_AUTH_TOKEN` before stabilization. It also did not explicitly disable provenance.

## Root-cause hypothesis

The npm failure is likely toolchain/provenance-triggered by Node 24 / latest npm / OIDC-permitted workflow context entering npm's provenance internals, where `sigstore` resolution failed.

## Stabilization direction

For first-publish stability:

- use Node 22 for publish jobs
- do not upgrade npm to latest inside the workflow
- publish npm with `--provenance=false`
- set `NPM_CONFIG_PROVENANCE=false`
- use `NODE_AUTH_TOKEN` for token-based npm publish
- keep `publishConfig.access: public`

## Blockers

None.
