# Form Renderer Field Options Polish Foundation Final Verification

## Commands run

```bash
bun test tests/form-html-renderer.test.js
bun examples/form-rendering-basic/index.js
bun run test
bun run check:release
npm pack --dry-run --json
npm pack --pack-destination <tmp> --json
```

Packed installed artifact smoke was also run in a temporary project.

No publish commands were run.

## Results

### Focused renderer tests

```txt
15 pass
0 fail
68 expect() calls
```

### Full test suite

```txt
609 pass
0 fail
1486 expect() calls
```

### Release check

```txt
609 pass
0 fail
1486 expect() calls
```

### Pack dry-run

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 70
includes docs/internal/: no
```

### Packed installed renderer smoke

```txt
pass
```

Smoke verified from installed `@potentiajs/core/forms` import:

- textarea renders
- hidden renders
- select renders
- data attributes exist
- `aria-describedby` exists
- `aria-invalid` exists for error field
- dynamic values are escaped
- sensitive value does not leak
- temp project cleaned up

## Renderer polish

- textarea: implemented for explicit `field.input === 'textarea'` and tolerated `field.input.type === 'textarea'`
- hidden: implemented for explicit `field.input === 'hidden'` and tolerated `field.input.type === 'hidden'`
- select/options: supports string options and `{ value, label }`; escapes values/labels; selected from state/default; malformed object options without usable `value` ignored; no invented empty option
- data attributes: stable `data-potentia-*` attributes implemented
- accessibility: label/control IDs, help/error IDs, `aria-describedby`, `aria-invalid`, and native `required` implemented
- root changed: no
- subpath changed: no; forms subpath still exports only `renderForm`
- deferred: classNames, themes, slots, custom renderers, raw HTML, public `renderField`, public `escapeHtml`, fieldsets/groups, repeaters, multi-select polish, rich text, file inputs, frontend runtime, hydration, compiler/template integration

## Invariants verified

- package name unchanged
- version unchanged
- root exports unchanged (`24` exports)
- forms subpath unchanged
- forms subpath exports only `renderForm`
- no JSX introduced
- no frontend runtime added
- no compiler added
- no classNames/custom renderers added
- no dependencies added
- README accurate
- examples accurate
- packed smoke passes
- release blockers remain parked
- no real publish

## Files changed

Implementation:

- `src/forms.js`

Tests:

- `tests/form-html-renderer.test.js`

Docs/examples:

- `README.md`
- `examples/form-rendering-basic/index.js`
- `examples/form-rendering-basic/README.md`
- `examples/full-flow-basic/README.md`
- `docs/internal/form-renderer-field-options-foundation-scope-lock.md`
- `docs/internal/form-renderer-input-type-normalization.md`
- `docs/internal/form-renderer-textarea-hidden-rendering.md`
- `docs/internal/form-renderer-select-options-polish.md`
- `docs/internal/form-renderer-data-attributes-accessibility.md`
- `docs/internal/form-renderer-field-options-tests.md`
- `docs/internal/form-renderer-field-options-docs.md`
- `docs/internal/form-renderer-field-options-package-smoke.md`
- `docs/internal/form-renderer-field-options-polish-foundation-final-verification.md`

## Remaining blockers

None for this renderer polish foundation block.

Parked release blockers remain separate:

- npm registry visibility
- JSR version visibility
- remote CI/publish workflow failures

## Recommendation

Recommended next block:

```txt
Release Blocker Fix Pass
```

Reason: public preview surface is now substantial and local package/test/pack evidence is strong.

Alternatives:

- HTML Template Layer Design Gate
- Form Renderer ClassNames / Customization Design Gate
