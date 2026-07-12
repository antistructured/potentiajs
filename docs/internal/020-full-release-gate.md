# 0.2.0 Full Release Gate

## Commands run

```bash
bun run test
bun run check:release
npm pack --dry-run --json
npx jsr publish --dry-run --allow-dirty
node -e 'const p=require("./package.json"); const j=require("./jsr.json"); if (p.version !== j.version) throw new Error(`${p.version} !== ${j.version}`); console.log(p.version)'
bun run examples/html-basic/index.js
bun test tests/full-flow-basic-example.test.js
```

Also ran a live root export audit to confirm HTML helpers remain subpath-only.

## Results

Version:

```txt
0.2.0
```

Tests:

```txt
640 pass
0 fail
1558 expect() calls
Ran 640 tests across 86 files.
```

`check:release`:

```txt
pass
```

HTML basic example:

- status: `200`
- content type: `text/html; charset=utf-8`
- includes doctype/page shell
- escaped unsafe content
- preserved explicit trusted raw HTML

Full-flow example smoke:

```txt
1 pass
0 fail
35 expect() calls
```

Root export audit:

```json
{
  "rootHasHtml": [],
  "html": [
    "attrs",
    "escapeHtml",
    "fragment",
    "html",
    "htmlResponse",
    "layout",
    "page",
    "raw"
  ]
}
```

## npm pack

Package:

- name: `@potentiajs/core`
- version: `0.2.0`
- file count: `60`

Confirmed:

- includes `src/html.js`
- includes `src/html.d.ts`
- includes `examples/html-basic/`
- includes `examples/full-flow-basic/`
- excludes `docs/internal/`
- excludes `tests/`

## JSR dry-run

Result:

```txt
pass
```

Confirmed:

- includes `src/html.js`
- includes `src/html.d.ts`
- `jsr.json` exports include `./html`
- JSR artifact remains lean by configured include/exclude posture

## Blockers

None.

No publish was run in this pass.
