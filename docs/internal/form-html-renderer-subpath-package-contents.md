# Form HTML Renderer Subpath / Package Contents

## Files inspected

- `package.json`
- `src/index.js`
- `docs/internal/form-html-renderer-foundation-scope-lock.md`

## Files changed

- `package.json`
- `src/forms.js`
- `src/forms.d.ts`
- `docs/internal/form-html-renderer-subpath-package-contents.md`

## Subpath

Added public subpath:

```txt
@potentiajs/core/forms
```

Package export:

```json
"./forms": {
  "types": "./src/forms.d.ts",
  "import": "./src/forms.js"
}
```

## Public export

The forms subpath exports only:

```txt
renderForm
```

The package root was not changed and does not export `renderForm`.

## Package contents

Added to package files:

- `src/forms.js`
- `src/forms.d.ts`

No dependencies were added.

## Blockers

None.

## Publish status

No publish command was run.
