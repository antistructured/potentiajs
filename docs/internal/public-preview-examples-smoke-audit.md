# Public Preview Examples Smoke Audit

## Files inspected

- `examples/kernel-basic/`
- `examples/sigiljs-basic/`
- `examples/composed-basic/`
- `examples/action-basic/`
- `examples/form-state-basic/`
- `examples/file-routing-dev/`
- `tests/*example*.test.js`
- `package.json` files allowlist

## Files changed

- `docs/internal/public-preview-examples-smoke-audit.md`

## Smoke verification

Ran:

```bash
bun test tests/kernel-basic-example.test.js tests/sigiljs-basic-example.test.js tests/composed-basic-example.test.js tests/action-basic-example.test.js tests/form-state-basic-example.test.js tests/form-projection-example.test.js tests/file-routing-dev-example.test.js
```

Result:

- `31 pass`
- `0 fail`
- `80 expect() calls`

## Example audit

| Example | Purpose | Package? | Smoke test? | Keep? | Notes |
| --- | --- | --- | --- | --- | --- |
| `examples/kernel-basic/` | Minimal route/kernel/contract/effect smoke app. | Yes | `tests/kernel-basic-example.test.js` | Yes | Earns its place as first kernel example. Uses source-relative imports in repo. |
| `examples/sigiljs-basic/` | Focused SigilJS contract boundaries. | Yes | `tests/sigiljs-basic-example.test.js` | Yes | Useful split from kernel example because contracts are central. |
| `examples/composed-basic/` | Explicit route composition, scoped hooks/contracts, tiny plugin seam. | Yes | `tests/composed-basic-example.test.js` | Yes | More advanced but demonstrates core composition story. |
| `examples/action-basic/` | `action()`, JSON input, URL-encoded input, redirects, projection/manifest metadata. | Yes | `tests/action-basic-example.test.js` | Yes | Useful action foundation example; README accurately avoids form/client/OpenAPI claims. |
| `examples/form-state-basic/` | `createFormState(...)`, safe values, sensitive omission, `projectForm(...)` metadata. | Yes | `tests/form-state-basic-example.test.js`, `tests/form-projection-example.test.js` | Yes | Useful as forms/actions bridge without rendering. |
| `examples/file-routing-dev/` | Internal dev-only file-routing projection workflow. | No | `tests/file-routing-dev-example.test.js` | Repo-only | Should remain excluded until public file-routing API design gate. |
| `examples/UserProfile.view` | Historical/placeholder view artifact. | No | No | Repo-only / review later | Not shipped; keep out of package until `.view` compiler story exists. |

## Import posture

Shipped examples currently import source-relative paths such as `../../src/index.js` because nested example self-import is not reliable before publish prep. This is documented in core example READMEs. The packed artifact install smoke separately verifies installed package root imports.

## Package inclusion

The package allowlist intentionally includes only:

- `examples/kernel-basic/`
- `examples/sigiljs-basic/`
- `examples/composed-basic/`
- `examples/action-basic/`
- `examples/form-state-basic/`

It excludes internal/dev examples and generated-file routing workflows.

## Duplication assessment

There is some overlap in `createApp`/`route` usage, but each example demonstrates a distinct maturity layer. No example should be removed in this re-gate.

## Blockers

No broken or misleading shipped example was found. Before public preview publish prep, consider whether source-relative imports in shipped examples should be converted to package-root imports after install-from-packed-artifact behavior is established.
