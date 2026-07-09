# Form Renderer Field Options Polish Final Verification

## Commands run

```bash
bun run test
bun run check:release
npm pack --dry-run --json
```

Additional invariant check verified:

- package name unchanged
- version unchanged
- root export count unchanged
- `renderForm` not exported from root
- forms subpath exports only `renderForm`
- file-routing subpath exports only `generateFileRoutes`
- dependencies unchanged
- no `.jsx` or `.tsx` files under `src/` or `examples/`
- required form-renderer polish design docs exist

No publish commands were run.

## Results

### Tests

```txt
604 pass
0 fail
1458 expect() calls
```

### Release check

```txt
604 pass
0 fail
1458 expect() calls
```

### Pack dry-run

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 70
includes docs/internal/: no
```

## Design docs created

- `docs/internal/form-renderer-field-options-polish-scope-lock.md`
- `docs/internal/form-renderer-textarea-multiline-decision.md`
- `docs/internal/form-renderer-select-options-decision.md`
- `docs/internal/form-renderer-hidden-checkbox-scalar-decision.md`
- `docs/internal/form-renderer-data-attributes-styling-decision.md`
- `docs/internal/form-renderer-accessibility-defaults-decision.md`
- `docs/internal/form-renderer-field-options-polish-design-report.md`

## Polish decision

- textarea: support explicit multiline metadata only; initial signal `field.input === 'textarea'` and implementation may tolerate `field.input.type === 'textarea'`
- select/options: support string options and `{ value, label }`; escape values/labels; selected state from state/default; do not invent empty option; defer multi-select polish
- hidden: support only explicit hidden metadata; hidden values are never trusted; no label/help/errors inline by default
- checkbox: keep `value="true"`; checked from conservative truthy state/default values
- multiple scalar: keep repeated-control behavior for now
- styling: `data-potentia-*` attributes are the first styling/testing contract
- classNames: deferred
- accessibility: include labels/ids/help/error IDs/`aria-describedby`/`aria-invalid`/native `required`; minimal ARIA, native HTML first
- deferred: classNames, themes, slots, custom renderers, public `renderField`, public `escapeHtml`, raw HTML, repeaters, groups, rich text, multipart/file input, frontend runtime, hydration, compiler

## Invariants verified

- no source implementation added
- no package exports changed
- no root exports changed
- no subpath exports changed
- no README feature claims added
- no JSX introduced
- no frontend runtime added
- no compiler added
- no dependencies added
- design docs exist
- checks pass

## Recommendation

```txt
A — Implement Field Options Polish Foundation
```

Recommended next block:

```txt
Form Renderer Field Options Polish Foundation
```

Implementation scope should stay narrow:

- textarea support
- refined select/options rendering
- hidden input support
- stable `data-potentia-*` attributes
- baseline accessibility attributes
- tests
- docs
- no JSX/frontend runtime/compiler

## Remaining blockers

None for this design gate.

Parked release blockers remain separate:

- npm registry visibility
- JSR version visibility
- remote CI/publish workflow failures

## Publish status

No publish command was run.
