# CLI Package Expectation Test Audit

## File inspected

- `tests/file-routing-cli.test.js`

## Test audited

```txt
file routing CLI package expectations > package exposes potentia bin without root API pollution
```

## Exact assertions

The test asserts:

```js
expect(packageJson.bin).toEqual({ potentia: './bin/potentia.js' });
expect(existsSync(new URL('../bin/potentia.js', import.meta.url))).toBe(true);
expect('main' in rootApi).toBe(false);
expect('parseArgs' in rootApi).toBe(false);
expect('checkFileRoutes' in rootApi).toBe(false);
expect('generateFileRoutes' in rootApi).toBe(false);
expect(Object.keys(fileRoutingApi).sort()).toEqual(['generateFileRoutes']);
```

## Reproduction result before final fix

Focused test import failed before running assertions because `src/cli.js` had regressed and no longer exported current CLI test symbols:

```txt
SyntaxError: Export named 'createJsonEnvelope' not found in module '/home/d/Workspace/projects/potentiajs/src/cli.js'.
```

## Root-cause finding

Two package/CLI surface regressions were present in the working tree:

1. `package.json` had been normalized by npm tooling to `bin.potentia: "bin/potentia.js"`, while the intended/tested contract is `"./bin/potentia.js"`.
2. `src/cli.js` had accidentally regressed to an older generate-only implementation, removing check-mode/JSON exports used by the CLI tests.

## Acceptance

The exact assertions are known before patching, and the root cause is package metadata plus accidental CLI implementation rollback rather than a need to expand the public root API.
