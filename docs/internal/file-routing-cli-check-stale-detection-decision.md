# File Routing CLI Check Stale Detection Decision

## Files inspected

- `src/dev/file-routing/writer.js`
- `src/dev/file-routing/generator.js`
- `src/dev/file-routing/scanner.js`
- `src/cli.js`
- `docs/internal/file-routing-cli-check-command-shape-decision.md`

## Decision

Future check mode should determine current/stale/missing status without writing project files.

Algorithm:

1. Resolve `root`, `out`, `package`, and `cwd` with the same semantics as `routes generate`.
2. Run the same scanner/generator path used by `generateFileRoutes(...)`.
3. Generate the expected route module source in memory.
4. Read the existing output file.
5. Compare expected source to current output using normalized-newline comparison.
6. Report one of:
   - `current`
   - `missing`
   - `stale`
   - `failed`

## Required internal shape

The existing public `generateFileRoutes(...)` writes output as part of generation. Check mode should not call it directly unless a future internal option supports non-writing behavior.

Recommended implementation approach:

- add a small internal helper that shares scanner/generator logic and can return generated source without writing
- keep the public `generateFileRoutes(...)` behavior unchanged
- keep the public `@potentiajs/core/file-routing` subpath unchanged
- keep check helper internal to `src/dev/file-routing/` or `src/cli.js` support code

Possible internal helper shape, design only:

```js
createExpectedFileRoutes({ rootDir, outputFile, packageName, cwd })
```

It should return the same route/scopes/source/diagnostics metadata needed by generate and check.

## Comparison strategy

Use normalized newline comparison:

```txt
normalize LF/CRLF before comparison
```

Rationale:

- generated source is deterministic enough for text comparison
- avoids cross-platform CRLF false negatives
- avoids adding parser dependencies
- avoids semantic comparison complexity

Do not use semantic AST comparison in the first implementation.

## Missing output behavior

If output file does not exist:

```txt
status: missing
exit: 1
```

Message should tell users to run:

```bash
potentia routes generate
```

Missing output is not an invalid usage error because the command syntax is valid.

## Stale output behavior

If output file exists but differs after newline normalization:

```txt
status: stale
exit: 1
```

Message should tell users to run:

```bash
potentia routes generate
```

Do not include a diff in the first implementation. A diff creates output-size and privacy concerns and can be added later behind an explicit flag if needed.

## Scanner/generator failure behavior

If scanner or generator diagnostics fail:

```txt
status: failed
exit: 1
```

Use the same diagnostic formatting as `routes generate`.

## Non-mutation rule

Check mode must not:

- create `.potentia/`
- write `.potentia/routes.generated.js`
- replace existing output
- clean generated output
- create temp output in the project

If an implementation needs temporary files, they must not be written inside the project tree. Prefer no files at all.

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
