# 0.1.0 Publish Workflow Result

## Commit

- commit: `073a17dba16c1ad03378f6cd3eec3e662cf5ad93`
- message: `Release PotentiaJS 0.1.0`
- branch: `main`
- push: succeeded after rebasing onto `origin/main`

## Workflow

- workflow: `Publish`
- run id: `29115079309`
- URL: `https://github.com/antistructured/potentiajs/actions/runs/29115079309`
- trigger: push to `main`
- conclusion: success

## Jobs

- Verify package: pass
- Publish to npm: pass
- Publish to JSR: pass

## npm tag

Publish job metadata confirmed:

```txt
Package: @potentiajs/core@0.1.0
npm tag: latest
```

The npm dist-tag verification retried until registry propagation completed:

```txt
npm latest verification attempt 1: exact missing, latest still 0.1.0-preview.0
npm latest verification attempt 2: exact 0.1.0, latest 0.1.0
npm latest tag verified.
```

## Result

The GitHub publish workflow successfully published `@potentiajs/core@0.1.0` to npm and JSR.

## Notes

GitHub Actions emitted non-blocking warnings about `actions/setup-node@v4` inputs / Node runtime deprecation. They did not fail the publish workflow.

## Blockers

None.
