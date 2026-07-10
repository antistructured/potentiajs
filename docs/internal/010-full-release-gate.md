# 0.1.0 Full Release Gate

## Commands run

```bash
bun run test
bun run check:release
npm pack --dry-run --json
npx jsr publish --dry-run --allow-dirty
node -e 'const p=require("./package.json"); const j=require("./jsr.json"); if (p.version !== j.version) throw new Error(`${p.version} !== ${j.version}`); console.log(p.version)'
```

No manual publish was run.

## Results

### `bun run test`

```txt
609 pass
0 fail
1487 expect() calls
```

### `bun run check:release`

```txt
609 pass
0 fail
1487 expect() calls
```

### Version consistency

```txt
0.1.0
```

`package.json` and `jsr.json` versions match.

## npm pack

`npm pack --dry-run --json` result:

```txt
package: @potentiajs/core
version: 0.1.0
entry count: 56
```

Confirmed npm package contents:

- `bin/potentia.js`: present
- intended examples: present
- `docs/internal/`: absent
- `tests/`: absent
- generated `.potentia/`: absent

## JSR dry-run

`npx jsr publish --dry-run --allow-dirty` result:

```txt
Success: dry run complete
artifact entries: 36
```

Confirmed JSR artifact contents:

- `README.md`: present
- `LICENSE`: present
- `package.json`: present
- `src/index.js`: present
- `src/index.d.ts`: present
- `src/file-routing.js`: present
- `src/file-routing.d.ts`: present
- `src/forms.js`: present
- `src/forms.d.ts`: present
- `src/dev/file-routing/*`: present
- `src/kernel/*`: present

Confirmed absent from JSR dry-run:

- `.github/`
- `docs/`
- `tests/`
- `examples/`
- `plugins/`
- `scripts/`
- `cli/`
- `.potentia/`
- `bun.lock`
- exploratory root `.mjs` files
- `*.view` files

## Blockers

None.
