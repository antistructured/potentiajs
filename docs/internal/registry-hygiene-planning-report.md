# Registry Hygiene Planning Report

## 1. Published preview status

Published and publicly verified package:

```txt
@potentiajs/core@0.1.0-preview.0
```

Verified public smoke:

- npm registry visibility: pass
- JSR registry visibility: pass
- fresh npm install: pass
- root import: pass
- file-routing subpath import: pass
- forms subpath import: pass
- CLI binary: pass
- `potentia routes generate --json`: pass
- `potentia routes check --json`: pass
- generated routes served through `createApp(...)`: pass
- `renderForm(...)` from registry install: pass

## 2. npm dist-tag status

Read-only registry check:

```json
{
  "preview": "0.1.0-preview.0",
  "latest": "0.1.0-preview.0"
}
```

Published versions:

```json
[
  "0.1.0-preview.0"
]
```

## 3. npm dist-tag decision

Decision:

- Leave current `latest` alone unless it causes install confusion.
- Future preview publishes should use `--tag preview` intentionally.
- Future preview verification should check whether `latest` moved accidentally.
- Final `0.1.0` should intentionally publish/promote `latest`.

Rationale:

- only one version currently exists
- package is usable and clearly marked experimental
- removing `latest` now may create odd npm UX
- final release can correct `latest` naturally

No `npm dist-tag` mutation is recommended in this planning pass.

## 4. JSR artifact finding

Current JSR version metadata reports `90` manifest entries.

Unexpected included content includes:

- `.github/workflows/*`
- `bun.lock`
- `cli/*`
- `examples/file-routing-dev/*`
- `examples/UserProfile.view`
- `jsr.json`
- `plugins/*`
- `potentia.config.mjs`
- `reactive.mjs`
- `scripts/generate-file-routes.js`
- `ui.mjs`

Confirmed absent:

- `docs/internal/`
- `tests/`
- generated `.potentia/`

## 5. JSR artifact decision

Decision:

- Make JSR artifact leaner in a hygiene implementation pass.
- Keep npm examples as-is.
- Do not ship examples on JSR for now.
- Keep `src/dev/file-routing/` on JSR because it is reachable from the public `@potentiajs/core/file-routing` subpath.
- Do not ship `bin/potentia.js` on JSR unless a future pass intentionally adds JSR binary support.
- Exclude repo-only docs, tests, examples, workflows, scripts, plugins, generated output, and exploratory root files.

Recommended implementation task:

- verify current JSR config schema
- update `jsr.json` include/exclude posture
- run `npx jsr publish --dry-run --allow-dirty`
- inspect dry-run manifest before publishing any future version

## 6. Internal docs tracking decision

Decision:

- Commit the post-publish verification docs.
- Commit the registry hygiene planning docs.

Rationale:

- `docs/internal` is the project audit trail.
- The first public-registry verification pass is important release evidence.
- Package artifacts already exclude `docs/internal` from npm, and JSR hygiene should exclude all docs.

## 7. Patch preview decision

Decision:

```txt
Prepare 0.1.0-preview.1 if jsr.json/package artifact config changes.
```

Version target for implementation, if accepted:

```txt
0.1.0-preview.1
```

Rationale:

- JSR artifact content changes require a new published version to verify externally.
- A tiny preview patch is a safer release rehearsal before `0.1.0`.
- The package is now publicly verified, so the patch should remain strictly hygiene-only.

If implementation discovers no config/artifact changes are needed, use workflow/docs-only changes and skip a new preview.

## 8. Required implementation changes

Recommended next implementation pass should include:

1. Verify exact current JSR config schema.
2. Update `jsr.json` to enforce a lean artifact.
3. Decide whether to keep top-level `include`/`exclude` or migrate to `publish.include`/`publish.exclude` based on current JSR CLI behavior.
4. Add/adjust a dry-run manifest check for JSR artifact contents.
5. Ensure npm preview publish path uses `--tag preview` and verifies dist-tags after publish.
6. Add changelog entry for `0.1.0-preview.1` only if version bump is accepted.
7. Bump `package.json` and `jsr.json` to `0.1.0-preview.1` only in the implementation pass if JSR artifact changes are made.
8. Run full local checks.
9. Do not publish without explicit owner command.

## 9. No-publish guarantee

No publish or dist-tag mutation command was run in this planning pass.

Forbidden in this pass:

- `npm publish`
- `npx jsr publish`
- `npm dist-tag rm`
- `npm dist-tag add`

## 10. Recommendation

Recommendation:

```txt
A — Run Registry Hygiene Patch Implementation
```

Scope for the implementation pass:

- no framework source/API changes
- no renderer/file-routing behavior changes
- JSR artifact hygiene
- npm dist-tag verification posture
- internal docs committed as audit trail
- prepare `0.1.0-preview.1` only if artifact config changes are made

## Blockers

No blockers for planning.

Implementation blocker to resolve:

- confirm exact JSR include/exclude schema and dry-run manifest behavior before version bump or publish.
