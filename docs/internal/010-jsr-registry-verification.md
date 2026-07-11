# 0.1.0 JSR Registry Verification

## Commands run

```bash
npx jsr info @potentiajs/core
curl -fsSL https://jsr.io/@potentiajs/core/meta.json
curl -fsSL https://jsr.io/@potentiajs/core/0.1.0_meta.json
```

## Confirmed

- JSR package visible: yes
- JSR latest: `0.1.0`
- version `0.1.0` visible: yes
- versions visible:
  - `0.1.0-preview.0`
  - `0.1.0-preview.1`
  - `0.1.0`
- no export parse errors

## Exports

```json
{
  ".": "./src/index.js",
  "./file-routing": "./src/file-routing.js",
  "./forms": "./src/forms.js"
}
```

## Artifact

Manifest count:

```txt
36
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
