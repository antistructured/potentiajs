# 0.2.0-preview.0 Version / Changelog Prep

## Previous version

```txt
0.1.0
```

## Current version

```txt
0.2.0-preview.0
```

## Files changed

- `package.json`
- `jsr.json`
- `README.md`
- `CHANGELOG.md`
- `docs/internal/020-preview0-version-changelog.md`

## Version verification

```bash
node -e 'const p=require("./package.json"); const j=require("./jsr.json"); if (p.version !== j.version) throw new Error(`${p.version} !== ${j.version}`); console.log(p.version)'
```

Result:

```txt
0.2.0-preview.0
```

## Changelog

Added `## 0.2.0-preview.0` with:

- `@potentiajs/core/html`
- safe HTML values and escaping helpers
- `raw(...)`
- tagged `html` templates
- `fragment(...)`
- `attrs(...)`
- `htmlResponse(...)`
- `examples/html-basic`

## Blockers

None.
