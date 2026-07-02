# Final Release Dry-Runs / Packed Smoke

## Files inspected

- `package.json`
- `README.md`
- `LICENSE`
- `CHANGELOG.md`
- `src/index.d.ts`
- `npm pack --dry-run --json` output
- `npm publish --dry-run --tag preview` output
- packed artifact install smoke output

## Files changed

- `src/dev/file-routing/generator.js`
- `scripts/generate-file-routes.js`
- file-routing tests that assert default package import names
- `tests/kernel-route-manifest.test.js`
- `examples/kernel-basic/README.md`
- `docs/internal/final-release-dryrun-smoke.md`

The source/test changes are package-identity alignment only: generated dev-route modules now default to `potentiajs` instead of the old package name.

## Test result

```txt
557 pass
0 fail
1173 expect() calls
```

## Release check result

```txt
557 pass
0 fail
1173 expect() calls
```

`bun run check:release` completed successfully.

## Pack result

`npm pack --dry-run --json` completed successfully.

Package summary:

- name: `potentiajs`
- version: `0.1.0-preview.0`
- tarball: `potentiajs-0.1.0-preview.0.tgz`
- entry count: `40`
- unpacked size: `110586`
- `LICENSE` included: yes
- `CHANGELOG.md` included: yes
- `src/index.d.ts` included: yes
- `docs/internal/` included: no
- `tests/` included: no

## Publish dry-run result

`npm publish --dry-run --tag preview` completed successfully.

Observed npm dry-run summary:

```txt
Publishing to https://registry.npmjs.org/ with tag preview and default access (dry-run)
+ potentiajs@0.1.0-preview.0
```

Note: a first attempt with `npm publish --dry-run` failed because npm requires an explicit tag for prerelease versions. The workflow and final publish guidance therefore use `--tag preview`.

## Packed artifact install smoke

Fresh temp project installed the packed tarball and executed a smoke script importing from `potentiajs`.

Observed output:

```json
{"packageName":"potentiajs","version":"0.1.0-preview.0","sigil":"function","exports":24,"status":200,"body":{"name":"Ada"},"formField":"name","hasPassword":false}
```

Smoke covered:

- root imports from `potentiajs`
- package name
- package version
- SigilJS dependency import
- basic app/action behavior
- `createFormState`
- `projectForm`
- 24 root exports
- sensitive form value omission

## Type file inclusion

`src/index.d.ts` is included in the packed artifact.

## Blockers

No local release dry-run blocker remains.

External blockers remain:

- npm account/2FA/trusted-publishing or token setup for CI publish
- real publish requires explicit owner command

## Publish status

Real publish was not run.
