# Post-Release Registry Install Smoke

## Package manager used

- Bun package manager

## Temp project

A temporary directory outside the repository was created under `/tmp` and removed after the attempted install.

Cleanup result:

```txt
cleanup_exists=no
```

## Install commands attempted

Because the final published identity is uncertain from live registry checks, both likely names were tested:

```bash
bun init -y
bun add @potentiajs/core@0.1.0-preview.0
bun add potentiajs@0.1.0-preview.0
```

## Results

### `@potentiajs/core@0.1.0-preview.0`

Result: **failed**.

Output:

```txt
bun add v1.3.14 (0d9b296a)
Resolving dependencies
Resolved, downloaded and extracted [1]
error: GET https://registry.npmjs.org/@potentiajs%2fcore - 404
```

### `potentiajs@0.1.0-preview.0`

Result: **failed**.

Output:

```txt
bun add v1.3.14 (0d9b296a)
Resolving dependencies
Resolved, downloaded and extracted [1]
error: GET https://registry.npmjs.org/potentiajs - 404
```

## Smoke file

No smoke file was executed because neither registry install completed.

## Dependency resolution result

- SigilJS dependency resolution from the published package could not be tested because the Potentia package itself was not found on npm.

## npm / Bun install smoke

- npm/Bun registry install: **fail / blocked by registry 404**
- root imports: not tested because install failed
- action route smoke: not tested because install failed
- `createFormState`: not tested because install failed
- `projectForm`: not tested because install failed

## JSR smoke

Not applicable yet. JSR API reports `@potentiajs/core` has `versionCount: 0` and `latestVersion: null`, so there is no versioned JSR artifact to import.

## Blockers

Real registry install smoke is blocked because no versioned npm package is visible.

This is a release/publish-completion issue, not a framework runtime issue.

## Publish status

No second publish occurred.
