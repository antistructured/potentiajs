# File Routing CLI JSON Package Smoke

## Files inspected

- `package.json`
- `bin/potentia.js`
- `src/cli.js`
- local packed artifact
- installed temp-project CLI output

## Files changed

- `docs/internal/file-routing-cli-json-package-smoke.md`

## Pack

Pack command:

```bash
npm pack --pack-destination <tmp> --json
```

Result:

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 57
```

No publish command was run.

## Installed CLI JSON smoke

A local tarball was installed into a fresh temp project.

Installed bin:

```txt
./node_modules/.bin/potentia: present
```

Route tree created:

```txt
routes/
  index.js
  users/
    [id].js
```

### Missing check before generation

Command:

```bash
./node_modules/.bin/potentia routes check --json
```

Result:

```txt
exit: 1
status: missing
ok: false
stderr: empty
output file created: false
stdout: valid JSON
```

### Generate JSON

Command:

```bash
./node_modules/.bin/potentia routes generate --json
```

Result:

```txt
exit: 0
status: generated
ok: true
stderr: empty
output file created: true
stdout: valid JSON
```

### Current check after generation

Command:

```bash
./node_modules/.bin/potentia routes check --json
```

Result:

```txt
exit: 0
status: current
ok: true
stderr: empty
stdout: valid JSON
```

### Stale check after modifying generated output

Command:

```bash
./node_modules/.bin/potentia routes check --json
```

Result:

```txt
exit: 1
status: stale
ok: false
stderr: empty
stdout: valid JSON
output rewritten: false
```

## Cleanup status

The temp install project and pack directory were removed after verification.

## Blockers

None.

## Publish status

No publish command was run.
