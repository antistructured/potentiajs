# Public Preview Docs Accuracy Report

## Files inspected

- `README.md`
- `examples/kernel-basic/README.md`
- `examples/sigiljs-basic/README.md`
- `examples/composed-basic/README.md`
- `docs/internal/`

## Files changed

- `README.md`
- `docs/internal/public-preview-docs-accuracy-report.md`

## README accuracy updates

Updated README to clearly state:

- Potentia is experimental.
- Potentia is Bun-first.
- Potentia is plain JavaScript ESM.
- Potentia has no TypeScript source.
- Potentia uses `@weipertda/sigiljs@0.18.0` for runtime contracts.
- The package is currently private.
- The current version is `0.0.1`.
- Suggested future preview target is `0.0.2-preview.0`.
- No public API is stable.
- Current capabilities are kernel/server-only.
- Current exports are experimental.
- File routing, frontend, compiler, CLI expansion, DB/auth, package split, and release automation remain deferred.
- Current registry blockers include missing root license, missing repository metadata, private package posture, and no Git repo in this checkout.

## Example docs review

The packaged example READMEs are concise and truthful:

- `examples/kernel-basic/README.md` describes generic contract kernel behavior and explicitly excludes frontend/CLI/compiler/DB/auth.
- `examples/sigiljs-basic/README.md` describes SigilJS contract boundaries and deterministic contract failures.
- `examples/composed-basic/README.md` describes explicit route composition, scoped contracts/hooks, and the minimal plugin seam.

No example README claims production readiness or stable APIs.

## Internal docs review

Existing internal docs contain historical reports and prior-state classifications. They are repo evidence, not public user docs. The new README now describes `docs/internal/` as repository evidence and notes that these files may be excluded from registry packages later.

## Accuracy decisions

- Kept docs concise and preview-oriented.
- Avoided production-ready language.
- Avoided stable API claims.
- Avoided full-stack positioning.
- Avoided public publish instructions.
- Kept internal docs linked only generally, not as package-consumer documentation.

## Blockers

- No root `LICENSE` file exists.
- No repository/bugs/homepage metadata exists.
- Package remains private.
- Public API remains experimental.
- Internal docs are currently included in package output; package contents pass must decide whether to keep or exclude them.
