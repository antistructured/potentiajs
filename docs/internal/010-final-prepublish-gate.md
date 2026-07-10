# 0.1.0 Final Pre-Publish Gate

## Commands run

```bash
git status --short
bun run test
bun run check:release
npm pack --dry-run --json
npx jsr publish --dry-run --allow-dirty
node -e 'const p=require("./package.json"); const j=require("./jsr.json"); if (p.version !== j.version) throw new Error(`${p.version} !== ${j.version}`); console.log(p.version)'
```

No publish command was run in this pass.

## Results

### Version

```txt
0.1.0
```

Confirmed:

- `package.json` version: `0.1.0`
- `jsr.json` version: `0.1.0`
- package and JSR versions match

### Tests

`bun run test`:

```txt
609 pass
0 fail
1487 expect() calls
```

`bun run check:release`:

```txt
609 pass
0 fail
1487 expect() calls
```

### npm pack

`npm pack --dry-run --json`:

```txt
package: @potentiajs/core
version: 0.1.0
entry count: 56
```

Confirmed npm package excludes:

- `docs/internal/`
- `tests/`
- generated `.potentia/`

### JSR dry-run

`npx jsr publish --dry-run --allow-dirty` completed successfully.

Expected lean artifact posture remains intact.

## Required verification

Confirmed:

- package version is `0.1.0`
- JSR version is `0.1.0`
- `CHANGELOG.md` has `## 0.1.0`
- `README.md` documents `0.1.0` final posture and final install docs
- publish workflow infers `latest` for final versions
- publish workflow still uses `preview` for preview versions
- tests pass
- release check passes
- npm pack passes
- JSR dry-run passes

## Files ready to commit

Release files:

- `.github/workflows/publish.yml`
- `CHANGELOG.md`
- `README.md`
- `jsr.json`
- `package.json`
- `docs/internal/010-*.md`

Working tree note:

- `.trunk/` is untracked and not part of this release-prep commit.

## Blockers

None.
