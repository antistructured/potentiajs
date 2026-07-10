# 0.1.0 npm / JSR Publish Posture Review

## Files inspected

- `.github/workflows/publish.yml`
- `package.json`
- `jsr.json`

## Workflow behavior

The publish workflow now computes the npm dist-tag from the package version:

```bash
if [[ "$VERSION" == *"-preview."* ]]; then
  TAG="preview"
else
  TAG="latest"
fi
```

npm publish uses the computed tag:

```bash
npm publish --access public --tag "$TAG" --provenance=false
```

Post-publish verification checks the same computed tag:

```bash
npm view "$NAME" dist-tags --json --registry=https://registry.npmjs.org
npm view "$NAME@$TAG" version --registry=https://registry.npmjs.org
```

## Changes made

- Updated `.github/workflows/publish.yml` to compute `preview` vs `latest` from version.
- Updated post-publish npm verification to check the computed tag.
- Removed static `publishConfig.tag: preview` from `package.json`, leaving `publishConfig.access: public`.

## Final tag behavior

For final versions such as:

```txt
0.1.0
```

npm publish uses:

```txt
latest
```

and verifies:

```txt
@potentiajs/core@latest == package.json version
```

## Preview tag behavior

For preview versions such as:

```txt
0.1.0-preview.1
```

npm publish uses:

```txt
preview
```

and verifies:

```txt
@potentiajs/core@preview == package.json version
```

If `latest` also points to a preview during preview releases, the workflow records that as informational and does not fail solely for that condition.

## JSR posture

JSR publish remains:

```bash
npx jsr publish
```

JSR version and exports are driven by `jsr.json`.

## Blockers

None.
