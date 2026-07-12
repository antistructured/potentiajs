# 0.2.0-preview.1 Version / Changelog Prep

## Previous version

```txt
0.2.0-preview.0
```

## Current version

```txt
0.2.0-preview.1
```

## Files changed

- `package.json`
- `jsr.json`
- `CHANGELOG.md`
- `README.md`
- `docs/internal/020-preview1-version-changelog.md`

## Changelog

Added `0.2.0-preview.1` entry with:

- `page(...)` for HTML document shell composition
- `layout(...)` for reusable server-first layout functions
- `examples/html-basic` page/layout composition
- `examples/full-flow-basic` routing/actions/forms/HTML page response composition

Notes preserve the subpath-only and no-JSX/no-compiler/no-hydration/no-VDOM/no-client-runtime posture.

## README

Updated the HTML-first responses section to demonstrate:

- `layout(...)`
- `page(...)`
- `htmlResponse(page(...))`
- existing escaping / raw trust boundary posture

## Version verification

Command:

```bash
node -e 'const p=require("./package.json"); const j=require("./jsr.json"); if (p.version !== j.version) throw new Error(`${p.version} !== ${j.version}`); console.log(p.version)'
```

Result:

```txt
0.2.0-preview.1
```

## Blockers

None.
