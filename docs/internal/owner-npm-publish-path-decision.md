# Owner npm Publish Path Decision

## Current npm state

- `private: true`
- `publishConfig`: absent
- package name: `potentia-js`
- npm publish dry-run: skipped in publish prep because package remains private and license/public publish intent was unresolved
- real npm publish: not run

## Owner decision

Decision: **mostly decided, pending external npm checks**.

Visibility:

```txt
public npm preview
```

Preferred npm package name:

```txt
potentiajs
```

Fallback package name:

```txt
@weipertda/potentiajs
```

Publish method:

```txt
CI publish desired
```

## Recommended CI publish shape

Use a protected/manual-trigger CI publish workflow rather than automatic publish on every push.

Recommended posture:

- keep normal CI as test/pack only
- add a separate release workflow in final release prep
- require `workflow_dispatch`
- require npm provenance if practical
- use trusted publishing/OIDC if available, otherwise a protected npm token secret
- require final local/CI dry-run before publish

## Required owner/external checks

Before flipping package posture:

- npm account access confirmed
- `potentiajs` package availability confirmed
- fallback `@weipertda/potentiajs` scope access confirmed if needed
- npm 2FA/token/trusted-publishing strategy decided
- CI environment protection decided

## Future changes if checks pass

During Final Public Preview Release Prep:

1. Apply chosen license and root `LICENSE`.
2. Apply chosen package name.
3. Apply chosen version.
4. Set `private: false`.
5. Add `publishConfig.access: public` if package is scoped or if explicit access metadata is desired.
6. Add release workflow for protected CI publish.
7. Run `bun run check:release`.
8. Run `npm pack --dry-run --json`.
9. Run `npm publish --dry-run` only after package is intentionally publishable.

## Blocked changes in this decision-capture block

- `private` was not flipped here.
- `publishConfig` was not added here.
- CI publish workflow was not added here.
- `npm publish` was not run.
- npm tokens/secrets were not created.
