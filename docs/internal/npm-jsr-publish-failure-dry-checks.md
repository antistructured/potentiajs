# npm / JSR Publish Failure Dry Checks

## Commands run

```bash
bun run test
bun run check:preview
bun run check:release
npm pack --dry-run --json
NPM_CONFIG_PROVENANCE=false npm publish --dry-run --access public --provenance=false
npx jsr publish --dry-run
npx jsr publish --dry-run --allow-dirty
```

No real publish command was run.

## Results

### `bun run test`

```txt
609 pass
0 fail
1487 expect() calls
```

### `bun run check:preview`

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

### `npm pack --dry-run --json`

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 70
docs/internal included: no
generated .potentia output included: no
```

### `npm publish --dry-run --access public --provenance=false`

Result:

```txt
pass
```

Important check:

```txt
sigstore error: no
```

The previous npm provenance/internal `sigstore` failure did not occur.

Note: the workflow publish command uses an explicit prerelease dist-tag:

```bash
npm publish --access public --tag preview --provenance=false
```

and `package.json` now includes:

```json
"publishConfig": {
  "access": "public",
  "tag": "preview"
}
```

### `npx jsr publish --dry-run`

Initial command result:

```txt
fail
```

Failure reason:

```txt
Aborting due to uncommitted changes. Check in source code or run with --allow-dirty.
```

Important check:

```txt
conditional export parse error: no
```

So the original JSR conditional-export parse failure is gone.

### `npx jsr publish --dry-run --allow-dirty`

Nearest safe validation command result:

```txt
pass
Success Dry run complete
```

Important check:

```txt
conditional export parse error: no
```

The dry run emitted warnings about JavaScript entrypoints without type declarations, but it completed successfully with `--allow-dirty`.

## Acceptance

- npm dry-run no longer hits `sigstore`
- JSR config parse failure is gone
- no real publish occurred
- test/check/pack pass

## Blockers

For local dry checks: none.

For real publishing:

- npm requires valid `NPM_TOKEN` secret for token-based publish
- JSR publish requires the workflow/registry authorization setup to be valid at runtime
- clean git state is required for JSR publish unless `--allow-dirty` is intentionally used for dry-run only
