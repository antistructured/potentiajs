# 0.2.0-preview.0 Pre-Publish Readiness Gate

## Commands run

```bash
git status --short
bun run test
bun run check:release
npm pack --dry-run --json
npx jsr publish --dry-run --allow-dirty
node -e 'const p=require("./package.json"); const j=require("./jsr.json"); if (p.version !== j.version) throw new Error(`${p.version} !== ${j.version}`); console.log(p.version)'
```

Additional export audit:

```bash
node --input-type=module
```

Verified root and HTML subpath exports from local source.

## Confirmed

- `package.json` version: `0.2.0-preview.0`
- `jsr.json` version: `0.2.0-preview.0`
- versions match: `0.2.0-preview.0`
- CHANGELOG has `0.2.0-preview.0` entry
- README documents `@potentiajs/core/html`
- package exports include `./html`
- JSR exports include `./html`
- root exports remain unchanged at the intentional 24-export surface
- HTML subpath exports:
  - `attrs`
  - `escapeHtml`
  - `fragment`
  - `html`
  - `htmlResponse`
  - `raw`
- `examples/html-basic/index.js` exists
- `bun run test`: pass
- `bun run check:release`: pass
- `npm pack --dry-run --json`: pass
- `npx jsr publish --dry-run --allow-dirty`: pass

## Test result

```txt
630 pass
0 fail
1529 expect() calls
Ran 630 tests across 86 files.
```

## npm pack

- file count: `60`
- includes `src/html.js`: yes
- includes `src/html.d.ts`: yes
- includes `examples/html-basic/`: yes
- excludes `docs/internal/`: yes

## JSR dry-run

- success: yes
- includes `src/html.js`: yes
- includes `src/html.d.ts`: yes

## Files ready to commit

Release implementation and docs are ready to commit, including:

- `CHANGELOG.md`
- `README.md`
- `package.json`
- `jsr.json`
- `src/html.js`
- `src/html.d.ts`
- `tests/html.test.js`
- `examples/html-basic/`
- `docs/internal/020-*.md`

## Blockers

None.

No manual publish occurred during this gate.
