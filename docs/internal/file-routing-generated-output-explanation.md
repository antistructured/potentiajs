# File Routing Generated Output Explanation

## Files inspected

- `README.md`
- `examples/file-routing-basic/README.md`
- `src/dev/file-routing/generator.js`
- `tests/file-routing-basic-example.test.js`

## Files changed

- `examples/file-routing-basic/README.md`
- `docs/internal/file-routing-generated-output-explanation.md`

## Docs added

`examples/file-routing-basic/README.md` now explains that generated output:

- starts with the PotentiaJS generated-file warning header
- imports `createRoutes` / `mount` from `@potentiajs/core`
- is inspectable JavaScript
- imports explicit route modules
- exports an explicit route collection
- does not scan the filesystem when a request arrives
- is usually written to `.potentia/routes.generated.js`
- is generated during a dev/build step
- is ignored by default through `.gitignore`
- is usually not committed by normal app projects
- may be committed or shipped by package authors only when intentionally chosen
- preserves previous valid output on generation failure through fail-closed diagnostics behavior

## Policy clarified

The docs describe file routing as:

```txt
route files → generateFileRoutes(...) → generated explicit route module → createApp(...)
```

They avoid magic/runtime language and avoid claiming automatic request-time filesystem routing.

## Blockers

None.

## Publish status

No publish command was run.
