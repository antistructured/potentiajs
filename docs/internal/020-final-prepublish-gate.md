# 0.2.0 Final Pre-Publish Gate

## Commands run

```bash
git status --short
bun run test
bun run check:release
npm pack --dry-run --json
npx jsr publish --dry-run --allow-dirty
node -e 'const p=require("./package.json"); const j=require("./jsr.json"); if (p.version !== j.version) throw new Error(`${p.version} !== ${j.version}`); console.log(p.version)'
bun run examples/html-basic/index.js
bun test tests/full-flow-basic-example.test.js
```

Also ran a live root export audit for HTML helper pollution.

## Confirmed

- `package.json` version: `0.2.0`
- `jsr.json` version: `0.2.0`
- versions match
- CHANGELOG has `0.2.0` entry
- README documents `0.2.0` final
- package exports include `./html`
- JSR exports include `./html`
- root exports remain unchanged / unpolluted
- `examples/html-basic` works
- `examples/full-flow-basic` works
- tests pass
- release check passes
- npm pack includes `src/html.js`
- npm pack includes `src/html.d.ts`
- npm pack includes `examples/html-basic/`
- npm pack includes `examples/full-flow-basic/`
- npm pack excludes `docs/internal/`
- JSR dry-run includes `src/html.js`
- JSR dry-run includes `src/html.d.ts`

## Results

Version check:

```txt
0.2.0
```

Test result:

```txt
640 pass
0 fail
1558 expect() calls
```

Full-flow example smoke:

```txt
1 pass
0 fail
35 expect() calls
```

npm pack:

- package: `@potentiajs/core@0.2.0`
- file count: `60`
- `src/html.js`: included
- `src/html.d.ts`: included
- `examples/html-basic/`: included
- `examples/full-flow-basic/`: included
- `docs/internal/`: excluded

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

## Files ready to commit

Release prep files and verification docs are ready to commit for `0.2.0`.

## Blockers

None.

No manual publish was run.
