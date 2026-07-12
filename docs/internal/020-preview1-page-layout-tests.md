# 0.2.0-preview.1 Page/Layout Tests

## Files changed

- `tests/html.test.js`
- `docs/internal/020-preview1-page-layout-tests.md`

## Tests added

Added coverage for `layout(...)`:

- throws if render is not a function
- returns a render function
- passes props
- escapes plain string render result
- preserves safe HTML render result
- flattens arrays without comma joining
- renders `null` / `undefined` as empty
- does not swallow render errors

Added coverage for `page(...)`:

- returns safe HTML value through string rendering
- includes doctype
- includes default `html lang="en"`
- supports custom `lang`
- supports `htmlAttrs`
- supports `bodyAttrs`
- includes charset meta
- includes viewport meta
- escapes title
- renders escaped plain head/body strings
- preserves safe head/body values
- supports `children` alias
- body wins over children
- composes with `htmlResponse(...)`

Boundary coverage:

- `page` and `layout` are visible from `@potentiajs/core/html`
- `page` and `layout` are not root exports

## Results

Command:

```bash
bun test tests/html.test.js
```

Result:

```txt
31 pass
0 fail
71 expect() calls
```

## Blockers

None.
