# 0.2.0-preview.0 Attribute Helper

## Files changed

- `src/html.js`
- `docs/internal/020-preview0-attrs-helper.md`

## Export

Added:

- `attrs(attributes)`

## Supported attrs

Supported values:

- strings
- numbers
- bigints
- `true` boolean attributes
- `false` / `null` / `undefined` omission
- class arrays
- nested class arrays
- `className` mapped to `class`

Examples:

```txt
attrs({ id: 'x' }) ->  id="x"
attrs({ disabled: true }) ->  disabled
attrs({ disabled: false }) -> empty
attrs({ hidden: null }) -> empty
attrs({ class: ['a', 'b'] }) ->  class="a b"
attrs({ className: 'a' }) ->  class="a"
```

## Rejected attrs

Rejected:

- invalid attribute names
- names containing spaces, quotes, equals signs, angle brackets, slash, or other invalid characters
- event handler attributes matching `/^on/i`
- non-object `attrs(...)` inputs
- array `attrs(...)` inputs

Invalid names throw `TypeError` with a clear message.

## Safety decisions

- Attribute names must match `/^[A-Za-z_:][A-Za-z0-9:_.-]*$/`.
- Event handler attributes are rejected in preview.0 to keep the helper safe by default.
- Attribute values are escaped, including safe HTML values.
- No object style serialization in preview.0.
- No camelCase `dataUserId` mapping in preview.0 except `className -> class`.

## Blockers

None.
