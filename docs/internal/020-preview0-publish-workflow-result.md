# 0.2.0-preview.0 Publish Workflow Result

## Commit

Implementation publish commit:

- SHA: `52d0e54d95b6b63e6612839fa192021871658952`
- message: `feat(html): add 0.2.0-preview.0 HTML foundation`
- workflow run: `29166847371`
- URL: `https://github.com/antistructured/potentiajs/actions/runs/29166847371`

Verification-doc commit:

- SHA: `24425f84353f12ef0bf5c3a1e8257e9f77f0d9b8`
- message: `Release PotentiaJS 0.2.0-preview.0`
- workflow run: `29166955318`
- URL: `https://github.com/antistructured/potentiajs/actions/runs/29166955318`

The implementation publish commit performed the actual npm/JSR publication. The later verification-doc commit saw the version already present and skipped the publish steps while still verifying the preview tag.

## Workflow

Actual publish workflow:

- workflow: `Publish`
- run id: `29166847371`
- conclusion: success
- trigger: push to `main`

Jobs:

- Verify package: pass
- Publish to npm: pass
- Publish to JSR: pass

Follow-up verification workflow:

- workflow: `Publish`
- run id: `29166955318`
- conclusion: success
- trigger: push to `main`

Jobs:

- Verify package: pass
- Publish to npm: pass, publish step skipped because version already existed
- Publish to JSR: pass, publish step skipped because version already existed

## npm tag

Actual publish job metadata confirmed:

```txt
Package: @potentiajs/core@0.2.0-preview.0
npm tag: preview
```

The npm publish workflow used `preview`, not `latest`.

Registry propagation during actual publish:

```txt
npm preview verification attempt 1: exact missing, preview 0.1.0-preview.1, latest 0.1.0
npm preview verification attempt 2: exact missing, preview 0.2.0-preview.0, latest 0.1.0
npm preview verification attempt 3: exact 0.2.0-preview.0, preview 0.2.0-preview.0, latest 0.1.0
npm preview tag verified.
```

Follow-up workflow verification:

```txt
npm exact: 0.2.0-preview.0
npm preview: 0.2.0-preview.0
npm latest: 0.1.0
npm preview tag verified.
```

## Result

`@potentiajs/core@0.2.0-preview.0` was published successfully to npm and JSR by the GitHub publish workflow.

No manual registry mutation was performed.

## Blockers

None.
