# Framework SigilJS Native Contracts

## Files inspected

- installed `@weipertda/sigiljs@0.18.0`
- `package.json`
- `src/kernel/contract.js`
- `tests/`

## Files changed

- `src/kernel/contract.js`
- `tests/kernel-sigiljs-contracts.test.js`

## Behavior added

The internal contract adapter now recognizes real SigilJS contracts.

Recognition is intentionally structural and conservative:

- object contract
- `parse()` function
- `safeParse()` function
- `toJSONSchema()` function
- `describe()` function
- `ast` own property

Recognized SigilJS contracts use native `contract.parse(value)`.

## Supported boundaries

SigilJS contracts now work through existing route options:

- `params`
- `query`
- `headers`
- `body`
- `response`

## Real API syntax

The installed SigilJS API uses JavaScript constructors/helpers, not string shorthand:

```js
import { sigil, optional } from '@weipertda/sigiljs';

const Params = sigil({ id: String });
const Query = sigil({ include: optional(String) });
const Response = sigil({ id: String, name: String });
```

## Failure behavior

- Failed SigilJS params/query/headers/body contracts return `POTENTIA_CONTRACT_FAILED` with status 400.
- Failed SigilJS response contracts return `POTENTIA_RESPONSE_CONTRACT_FAILED` with status 500.
- Generic function / parse / check contracts continue to work.

## Public API decision

No new public exports were added in this pass. SigilJS support is exposed through existing route contract options.

## Verification

Targeted verification passed:

```bash
bun test tests/kernel-sigiljs-contracts.test.js tests/kernel-contract-adapter.test.js
```

Result:

- 19 pass
- 0 fail

## Deferred

- Safe boundary diagnostics are handled in the next pass.
- Public projection helper decision is handled in the projection pass.
