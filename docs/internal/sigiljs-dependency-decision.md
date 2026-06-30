# SigilJS Dependency Decision

## Files inspected

- `package.json`
- `bun.lock`
- `README.md`
- `src/kernel/contract.js`
- `docs/internal/framework-contract-boundary-model.md`
- `docs/internal/framework-query-header-contracts.md`
- `docs/internal/framework-kernel-hardening-report.md`

## Package identity

Confirmed via:

```bash
npm view @weipertda/sigiljs version name exports --json
```

Result:

- name: `@weipertda/sigiljs`
- version: `0.18.0`
- export: `.` defaults to `./src/index.js`
- type declarations: `./index.d.ts`

## Dependency decision

Add `@weipertda/sigiljs@0.18.0` as the only runtime dependency.

Reasons:

- It is the expected package name for this project family.
- It is available from the current environment.
- It installs successfully with Bun.
- It imports from plain JavaScript / ESM.
- It exposes `sigil` and contract instances with `parse`, `check`, `safeParse`, `describe`, and projection helpers.

## Install verification

Command run:

```bash
bun add @weipertda/sigiljs@0.18.0
```

Outcome:

- Installed `@weipertda/sigiljs@0.18.0`.
- Updated `package.json`.
- Updated `bun.lock`.
- No unrelated dependency was intentionally added.

## Plain JavaScript import verification

Verified with Bun:

```bash
bun -e "import { sigil, optional } from '@weipertda/sigiljs'; /* create and parse contracts */"
```

Observed real API notes:

- Import works from plain JavaScript ESM.
- `sigil({ id: String })` creates a contract.
- `optional(Number)` works for optional object fields.
- SigilJS does **not** accept string shorthand such as `sigil({ id: 'string' })` in this installed version.
- Contract instances expose `parse`, `check`, `safeParse`, `describe`, `toJSONSchema`, and related projection/testing helpers.
- Failed parses throw `SigilValidationError` with a safe high-level message.

## Existing verification

After installation, existing tests still pass:

```bash
bun test
```

Result:

- 79 pass
- 0 fail
- 169 expect() calls

## Public-surface decision

No public API changed in this pass. Kernel behavior and exports remain unchanged until the adapter pass.

## Blockers

- The user-provided illustrative syntax using string definitions must be adjusted to real SigilJS constructor/helper definitions.
- Native Potentia contract integration is not implemented yet; this pass only installs and verifies the dependency.
