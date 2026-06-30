# Kernel README DX Polish

## Files inspected

- `README.md`
- `examples/kernel-basic/README.md`
- `examples/sigiljs-basic/README.md`
- `examples/composed-basic/README.md`
- `docs/internal/public-preview-docs-accuracy-report.md`
- `docs/internal/public-preview-api-classification.md`

## Files changed

- `README.md`
- `docs/internal/kernel-readme-dx-polish.md`

## README changes

Restructured README into concise preview-oriented sections:

1. What Potentia is
2. Current status
3. Install / local usage
4. Minimal route
5. SigilJS contract route
6. Route composition
7. Effects
8. Hooks
9. Error/result model
10. Examples
11. Commands
12. Current limitations
13. Public API status

## DX improvements

- Moved local first-run commands near the top.
- Reduced duplicate detail from earlier preview README.
- Added a short effects example.
- Added a short error/result model section.
- Grouped exports by purpose instead of only listing alphabetically.
- Made lower-level export risk explicit.
- Kept package-private and registry-blocker posture clear.

## Guardrails preserved

- No production-readiness claim.
- No stable API claim.
- No registry publish instruction.
- No frontend/full-stack overclaiming.
- Deferred features remain explicit.

## Blockers

- README still uses package-name imports for intended consumer shape; nested source examples remain source-relative until publish prep.
- Public registry readiness remains blocked by license/repository/private-package decisions.
