# Action URL-Encoded Parser

## Files inspected

- `src/kernel/action.js`

## Files changed

- `src/kernel/action.js`
- `tests/kernel-action-urlencoded-parser.test.js`
- `docs/internal/action-urlencoded-parser.md`

## Parser behavior

`parseUrlEncodedActionInput(text)` parses URL-encoded bodies into deterministic plain objects.

Policy:

- scalar fields become strings
- repeated fields become arrays of strings
- empty values remain empty strings
- `+` decodes to space
- percent-encoding is decoded with `decodeURIComponent`
- malformed percent-encoding fails safely
- values are not coerced to numbers, booleans, dates, null, or undefined

## Repeated fields

```txt
tag=a&tag=b
```

becomes:

```js
{ tag: ['a', 'b'] }
```

## Prototype pollution defense

Dangerous keys are rejected:

- `__proto__`
- `constructor`
- `prototype`

The parser returns a normal plain object for ergonomic contract validation while rejecting keys that could mutate object prototypes.

## Verification

```bash
bun test tests/kernel-action-content-type.test.js tests/kernel-action-urlencoded-parser.test.js tests/kernel-action-input.test.js
```

Result:

- 24 pass
- 0 fail

## Deferred

- nested bracket syntax
- array bracket syntax special handling
- deep object parsing
- coercion
- multipart
