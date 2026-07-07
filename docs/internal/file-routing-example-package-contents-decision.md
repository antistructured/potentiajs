# File Routing Example Package Contents Decision

## Files inspected

- `package.json`
- `examples/`
- `examples/file-routing-basic/`
- `examples/file-routing-dev/`
- `npm pack --dry-run --json` output

## Files changed

- `package.json`
- `docs/internal/file-routing-example-package-contents-decision.md`

## Decision

Ship the polished public example:

```txt
examples/file-routing-basic/
```

Keep the internal/dev wrapper example repo-only:

```txt
examples/file-routing-dev/
```

## Rationale

Ship `examples/file-routing-basic/` because the package already ships selected public examples:

- `examples/kernel-basic/`
- `examples/sigiljs-basic/`
- `examples/composed-basic/`
- `examples/action-basic/`
- `examples/form-state-basic/`

The file-routing subpath is now public preview API, so the package should include a representative example that uses the public subpath directly.

Keep `examples/file-routing-dev/` excluded because it documents the repo's internal script wrapper and is not the polished public API example.

## Pack impact

Pack dry-run passed after adding the example.

Observed summary:

- package: `@potentiajs/core`
- version: `0.1.0-preview.0`
- entry count: `55`
- includes `examples/file-routing-basic/`: yes
- includes `examples/file-routing-dev/`: no
- includes `.potentia/` generated output: no

Included public example files:

- `examples/file-routing-basic/app.js`
- `examples/file-routing-basic/generate.js`
- `examples/file-routing-basic/README.md`
- `examples/file-routing-basic/routes/health.js`
- `examples/file-routing-basic/routes/index.js`
- `examples/file-routing-basic/routes/users/_routes.js`
- `examples/file-routing-basic/routes/users/[id].js`

## Blockers

None.

## Publish status

No publish command was run.
