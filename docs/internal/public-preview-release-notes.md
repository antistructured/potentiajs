# Public Preview Release Notes Draft

## 1. Package

- Package: `potentia-js`

## 2. Version target

- Current version: `0.0.1`
- Draft preview target: `0.0.2-preview.0`
- Target is not applied yet because license/public publish decisions remain blocked.

## 3. Status

Potentia public preview draft: contracts, effects, actions, routing, diagnostics, and form metadata.

The package remains experimental, Bun-first, and not production-ready. No API is stable.

## 4. What is included

- routing kernel
- explicit route composition
- SigilJS contract boundaries
- explicit effect descriptors and helpers
- action primitive
- JSON action input
- URL-encoded action input
- normalized diagnostics
- safe form state helper
- renderer-independent form projection
- route/action/projection metadata
- deterministic route manifest projection
- focused examples
- root export smoke coverage
- package dry-run verification
- packed artifact install smoke

## 5. What is experimental

Everything in the public root API is experimental:

- app/route/action/form helpers
- result/response helpers
- effect descriptors/helpers
- projection and manifest helpers
- plugin seam
- diagnostic error constructor

## 6. What is not included

- stable API commitment
- production readiness claim
- frontend runtime
- form renderer/generator
- client SDK
- OpenAPI generator
- multipart/file upload helper
- session/flash helper
- public file-routing API
- TypeScript declarations
- package split
- CLI/compiler expansion
- DB/auth integration

## 7. Install notes

The package is not published yet. Until a manual publish gate succeeds, use local checkout or packed artifact experiments.

Future npm preview install shape, once published, is expected to be:

```bash
bun add potentia-js
```

## 8. Bun requirement

- Bun `>=1.3.0`

## 9. SigilJS dependency

- `@weipertda/sigiljs@0.18.0`

## 10. Known blockers

- license choice/root `LICENSE`
- package remains `private: true`
- npm access/2FA/package availability unconfirmed
- JSR scope/name/metadata unconfirmed
- TypeScript declaration story unresolved
- all APIs remain experimental

## 11. Publish command not run

No real publish command was run.

Not run:

```bash
npm publish
jsr publish
```
