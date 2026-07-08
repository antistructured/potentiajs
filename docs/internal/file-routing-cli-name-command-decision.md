# File Routing CLI Name / Command Decision

## Files inspected

- `package.json`
- `README.md`
- `scripts/generate-file-routes.js`
- `docs/internal/file-routing-cli-design-scope-lock.md`
- prior file-routing design reports

## Decision

Future binary:

```txt
potentia
```

Future first command:

```bash
potentia routes generate
```

Future package metadata shape, if implemented later:

```json
{
  "bin": {
    "potentia": "./bin/potentia.js"
  }
}
```

This block does not add that metadata.

## Rationale

`potentia routes generate` is the best initial command because:

- it is explicit about route tooling
- it describes a generation step, not a runtime router
- it leaves room for future sibling commands such as `routes check` or `routes watch`
- it avoids implying a full dev server or build system
- it maps directly to the public API `generateFileRoutes(...)`

## Command namespace

Use route tooling namespace:

```txt
routes
```

Initial command under that namespace:

```txt
generate
```

Potential future commands, not in first implementation:

```bash
potentia routes check
potentia routes watch
```

## Alternative retained as fallback

If binary collision or brand concern appears before implementation, fallback binary:

```txt
potentiajs
```

Fallback command:

```bash
potentiajs routes generate
```

Do not choose both. The current design recommendation is `potentia`.

## Rejected names / shapes

Rejected:

```bash
potentia generate-routes
```

Reason: flatter but less extensible; does not reserve a route-tooling namespace.

Rejected:

```bash
potentia file-routes
```

Reason: noun-only shape is less clear than `routes generate`.

Rejected:

```bash
potentia dev
```

Reason: implies a development server/process manager and hidden runtime ownership.

Rejected:

```bash
potentia build
```

Reason: implies a broader compiler/build platform.

Rejected for initial implementation:

```bash
bunx @potentiajs/core routes generate
```

Reason: this can work as an invocation form for a package binary, but it is not itself a binary/command design.

## Blockers

None. Binary name and first command are decided for a future implementation block.

## Implementation status

No implementation was added.

No package `bin` was added.

## Publish status

No publish command was run.
