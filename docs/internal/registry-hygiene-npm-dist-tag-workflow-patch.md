# Registry Hygiene npm Dist-Tag Workflow Patch

## Files inspected

- `.github/workflows/publish.yml`
- `.github/workflows/publish-preview.yaml`

## Files changed

- `.github/workflows/publish.yml`
- `docs/internal/registry-hygiene-npm-dist-tag-workflow-patch.md`

## Workflow behavior

The real publish workflow already publishes previews with:

```bash
npm publish --access public --tag preview --provenance=false
```

This pass added a post-publish verification step:

```bash
npm view "$NAME" dist-tags --json --registry=https://registry.npmjs.org
npm view "$NAME@preview" version --registry=https://registry.npmjs.org
```

The step verifies:

```txt
preview tag == package.json version
```

The step also prints the current `latest` value as informational.

## Latest handling

The workflow does not fail solely because:

```txt
latest == preview version
```

During the preview era, this is recorded but not treated as a blocker.

## Dist-tag mutation

No dist-tag mutation command was added or run.

The workflow verifies tags only; it does not run:

- `npm dist-tag add`
- `npm dist-tag rm`

## Preview prep workflow

`.github/workflows/publish-preview.yaml` remains a dry-run preparation workflow. It still verifies package checks and npm publish dry-run, but does not publish or mutate registry tags.

## Blockers

None.
