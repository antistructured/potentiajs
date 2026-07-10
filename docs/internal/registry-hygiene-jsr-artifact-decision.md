# Registry Hygiene JSR Artifact Decision

## Files inspected

- `jsr.json`
- `package.json`
- `docs/internal/post-publish-jsr-registry-visibility.md`
- `docs/internal/post-publish-registry-metadata-docs-check.md`
- JSR version metadata for `@potentiajs/core@0.1.0-preview.0`

## Current JSR config

```json
{
  "name": "@potentiajs/core",
  "version": "0.1.0-preview.0",
  "exports": {
    ".": "./src/index.js",
    "./file-routing": "./src/file-routing.js",
    "./forms": "./src/forms.js"
  },
  "include": [
    "src/**/*.js",
    "src/**/*.d.ts",
    "README.md",
    "LICENSE",
    "package.json"
  ],
  "exclude": [
    "docs/internal",
    "tests",
    "examples/**/.potentia"
  ]
}
```

## Actual JSR artifact finding

JSR version metadata currently reports `90` manifest entries.

Unexpected examples from the artifact include:

- `/.github/workflows/ci.yaml`
- `/.github/workflows/publish-preview.yaml`
- `/.github/workflows/publish.yml`
- `/bun.lock`
- `/cli/dev.mjs`
- `/cli/index.mjs`
- `/examples/UserProfile.view`
- `/examples/file-routing-dev/README.md`
- `/examples/file-routing-dev/index.js`
- `/examples/file-routing-dev/routes/index.js`
- `/examples/file-routing-dev/routes/users/[id].js`
- `/examples/file-routing-dev/routes/users/_routes.js`
- `/examples/file-routing-dev/routes/users/index.js`
- `/jsr.json`
- `/plugins/dsl-ui.mjs`
- `/potentia.config.mjs`
- `/reactive.mjs`
- `/scripts/generate-file-routes.js`
- `/ui.mjs`

Confirmed absent:

- `docs/internal/`
- `tests/`
- generated `.potentia/`

## Required questions

### 1. Which files did JSR include unexpectedly?

Workflow files, old/dev example files, root exploratory/prototype files, scripts, plugins, and extra config files appeared in the JSR artifact despite the intended lean config.

### 2. Is JSR using `include` as expected?

Decision: current published result suggests the include rules did not constrain the published artifact as intended, or the workflow published a tree/config state that was broader than the current intended posture. The next implementation pass must test `npx jsr publish --dry-run --allow-dirty` after config changes and inspect the exact manifest before publishing.

### 3. Are examples included intentionally on JSR?

Decision: no, not for the next hygiene patch.

Examples are useful in npm package docs, but JSR should be a lean runtime/source package unless there is a clear JSR-specific benefit.

### 4. Should examples ship on JSR or only npm?

Decision: only npm for now.

### 5. Should `src/dev/file-routing/` ship on JSR?

Decision: yes, because `@potentiajs/core/file-routing` currently exports `generateFileRoutes` from `src/dev/file-routing/writer.js`. It is runtime-reachable through the public subpath despite the `dev` directory name.

### 6. Should `bin/potentia.js` ship on JSR?

Decision: no, unless JSR needs binary metadata in a future pass. JSR verification target is module imports/exports, not npm binary installation.

### 7. Should docs/internal/tests/generated output be excluded?

Decision: yes.

Also exclude broad repo-only folders and prototypes.

## Decision

Tighten JSR to a lean module artifact for `0.1.0-preview.1`.

Keep npm package examples as-is, but make JSR content narrower.

## Recommended `jsr.json`

Recommended implementation posture:

```json
{
  "name": "@potentiajs/core",
  "version": "0.1.0-preview.1",
  "exports": {
    ".": "./src/index.js",
    "./file-routing": "./src/file-routing.js",
    "./forms": "./src/forms.js"
  },
  "publish": {
    "include": [
      "src/**/*.js",
      "src/**/*.d.ts",
      "README.md",
      "LICENSE",
      "package.json"
    ],
    "exclude": [
      "docs",
      "tests",
      "examples",
      ".github",
      ".potentia",
      "cli",
      "plugins",
      "scripts",
      "*.mjs",
      "*.view"
    ]
  }
}
```

Note: confirm exact JSR config schema during implementation. If JSR expects top-level `include`/`exclude`, keep top-level; if it requires `publish.include`/`publish.exclude`, migrate accordingly. The implementation pass must validate with `npx jsr publish --dry-run --allow-dirty` and inspect output.

## Blockers

No blocker for planning.

Implementation blocker to resolve later:

- exact JSR config include/exclude schema must be verified against current JSR CLI behavior before version bump/publish.
