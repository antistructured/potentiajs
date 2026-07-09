# Full Flow Example Package Contents Decision

## Files inspected

- `package.json`
- `examples/`
- `examples/full-flow-basic/`

## Files changed

- `package.json`
- `docs/internal/full-flow-example-package-contents-decision.md`

## Decision

Decision:

```txt
Option A — Ship examples/full-flow-basic/
```

Reason:

- existing public examples already ship in the package
- this is the best compact end-to-end example for public preview users
- registry users should be able to inspect the full story without leaving the installed package
- generated `.potentia/` output remains excluded

## Package allowlist

Added:

```txt
examples/full-flow-basic/
```

## Pack impact

Pack dry-run result:

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 70
includes examples/full-flow-basic/: yes
includes examples/full-flow-basic/.potentia/: no
includes docs/internal/: no
```

The package shape is:

- include `examples/full-flow-basic/README.md`
- include `examples/full-flow-basic/generate.js`
- include `examples/full-flow-basic/app.js`
- include `examples/full-flow-basic/form.js`
- include route source files
- exclude `examples/full-flow-basic/.potentia/`
- exclude `docs/internal/`

## Blockers

None.

## Publish status

No publish command was run.
