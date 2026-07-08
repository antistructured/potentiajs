# File Routing CLI Config / Watch Boundary Decision

## Files inspected

- `package.json`
- `README.md`
- `examples/file-routing-basic/README.md`
- `docs/internal/file-routing-cli-options-defaults-decision.md`
- `docs/internal/file-routing-cli-diagnostics-output-decision.md`

## Config decision

No config file in the first CLI implementation.

Rejected for first implementation:

```txt
potentia.config.js
package.json potentia field
.potentiarc
```

## Config rationale

The initial option surface is small:

```txt
--root
--out
--package
--cwd
```

A config file would introduce another stable API surface before the CLI has baseline usage evidence. File routing should remain explicit, and callers can use shell scripts or package scripts if they want repeatable flags.

Future possible config file:

```txt
potentia.config.js
```

Potential future shape, not committed:

```js
export default {
  routes: {
    root: 'routes',
    out: '.potentia/routes.generated.js',
    package: '@potentiajs/core'
  }
};
```

This is deferred and should be separately designed before implementation.

## Watch decision

Defer watch mode from the first CLI implementation.

Future possible command:

```bash
potentia routes watch
```

## Watch rationale

Watch mode adds process-management concerns beyond generation:

- filesystem watcher portability
- debounce behavior
- repeated diagnostics display
- initial run vs subsequent run semantics
- failure recovery
- terminal output lifecycle
- cleanup and signal handling
- possible interaction with app dev servers

The first CLI should remain a one-shot dev/build command.

## Future commands

Possible future route-tooling commands:

```bash
potentia routes check
potentia routes watch
```

Deferred command meanings:

- `routes check`: verify generated output is current without rewriting it
- `routes watch`: repeatedly run generation when route files change

Neither should be included in the first implementation.

## Compiler boundary

The CLI must not become a compiler in the file-routing baseline.

Disallowed for initial CLI:

- frontend build
- `.view` compilation
- server bundling
- route module transformation beyond explicit generated imports
- route handler execution

## Runtime boundary

The CLI must not own app runtime behavior:

- no hidden dev server
- no request-time scanning
- no global route registry
- no app boot process

## Blockers

None. Config and watch are intentionally deferred.

## Implementation status

No implementation was added.

No package metadata was changed.

## Publish status

No publish command was run.
