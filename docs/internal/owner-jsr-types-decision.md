# Owner JSR / Type Declaration Decision

## Current JSR blockers

- no `jsr.json`
- no `deno.json`
- dependency compatibility unresolved
- docs/export policy unresolved
- TypeScript declaration/type story unresolved

## Current type declaration blockers

- no TypeScript source
- no `.d.ts` files
- no generated declarations
- no JSDoc declaration pipeline
- no package `types` metadata

## Owner decision

Decision: **partially decided**.

JSR identity should mirror npm identity.

Because JSR package identity is scoped, recommended JSR identity is:

```txt
@weipertda/potentiajs
```

If npm uses the unscoped preferred name `potentiajs`, JSR should still use `@weipertda/potentiajs` to mirror the package name under the owner scope.

## Recommended JSR timing

Recommendation: **JSR Compatibility Design Gate before implementing JSR publishing**, unless the owner decides to ship npm-only first.

Reason:

- JSR metadata, docs/export policy, dependency compatibility, and type posture need a dedicated design pass.
- JSR expectations are more type/documentation-sensitive than npm.

## Type declaration recommendation

Best option for PotentiaJS public preview:

```txt
handwrite minimal conservative root declarations before public npm/JSR preview
```

Constraints:

- keep source plain JavaScript ESM
- do not convert source to TypeScript
- keep declarations conservative
- validate declarations with type smoke tests if added

Reason:

- npm users expect editor/type support for framework APIs
- JSR strongly benefits from a clear type story
- handwritten declarations are more controlled than rushed generation for an experimental JS source package

## Future changes if selected

During Final Public Preview Release Prep or a dedicated Type Declaration Prep pass:

1. Add minimal `index.d.ts` for root exports.
2. Add `types` metadata and `exports["."].types` as needed.
3. Include declaration file in package `files`.
4. Add type smoke validation.
5. Keep declarations explicitly experimental/conservative.

During JSR Compatibility Design Gate:

1. Decide `jsr.json` shape.
2. Decide package scope/name as `@weipertda/potentiajs` unless owner changes it.
3. Validate dependency compatibility.
4. Decide whether JSR ships with first preview or after npm preview.

## Blocked changes in this decision-capture block

- No `jsr.json` added here.
- No `deno.json` added here.
- No declaration files added here.
- No package `types` metadata added here.
