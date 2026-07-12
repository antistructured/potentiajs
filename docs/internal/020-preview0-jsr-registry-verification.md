# 0.2.0-preview.0 JSR Registry Verification

## Commands run

```bash
npx jsr info @potentiajs/core
curl -fsSL https://jsr.io/@potentiajs/core/meta.json
curl -fsSL https://jsr.io/@potentiajs/core/0.2.0-preview.0_meta.json
```

## Confirmed

- JSR package visible: yes
- version `0.2.0-preview.0` visible in package metadata: yes
- JSR default/latest remains `0.1.0`, as expected for preview release
- no export parse errors
- artifact remains lean

Visible versions:

```json
[
  "0.1.0",
  "0.1.0-preview.0",
  "0.1.0-preview.1",
  "0.2.0-preview.0"
]
```

## Exports

```json
{
  ".": "./src/index.js",
  "./file-routing": "./src/file-routing.js",
  "./forms": "./src/forms.js",
  "./html": "./src/html.js"
}
```

## Artifact

Manifest count:

```txt
38
```

Required files present:

- `README.md`
- `LICENSE`
- `package.json`
- `src/index.js`
- `src/index.d.ts`
- `src/file-routing.js`
- `src/file-routing.d.ts`
- `src/forms.js`
- `src/forms.d.ts`
- `src/html.js`
- `src/html.d.ts`

Repo-only files absent:

- `.github/`
- `docs/`
- `tests/`
- `examples/`
- `scripts/`
- `plugins/`
- `cli/`
- root exploratory `.mjs` files
- `.view` files

## Blockers

None.
