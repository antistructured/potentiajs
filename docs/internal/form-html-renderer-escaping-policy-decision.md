# Form HTML Renderer Escaping Policy Decision

## Files inspected

- `src/kernel/form-projection.js`
- `src/kernel/form-state.js`
- `docs/internal/form-html-renderer-api-shape-decision.md`

## Decision

Escape all dynamic HTML text and attribute values by default.

The renderer must escape:

- form action
- method
- enctype
- field name
- field id
- label
- value
- placeholder
- help text
- error messages
- option labels
- option values
- submit label
- any projected/custom string included in output

## Raw HTML policy

Decision:

```txt
No raw HTML bypass in first implementation.
```

Do not add `unsafeHtml`, raw slots, or raw attribute injection in the first renderer.

Rationale:

- renderer safety is the primary value of a framework-provided helper
- bypass options expand the API and security review surface quickly
- custom/raw rendering can wait until usage pressure proves a specific need

## Method policy

Method source order:

1. `options.method` when provided
2. `formProjection.method`
3. default `POST`

Allowed first-renderer methods:

```txt
GET
POST
```

Normalize rendered method to uppercase. If an unsupported method appears, fall back to `POST` or render a safe form-level diagnostic; first implementation should choose one behavior explicitly before coding.

Recommended first implementation behavior:

```txt
fallback to POST and do not throw
```

Reason: `projectForm(...)` currently permits method overrides, but the first HTML renderer should stay compatible with browser form methods.

## Enctype policy

Enctype source order:

1. `formProjection.encType`
2. default `application/x-www-form-urlencoded`

Allowed initial enctype:

```txt
application/x-www-form-urlencoded
```

`multipart/form-data` remains deferred because file upload/multipart action support is out of scope.

If a projection contains unsupported enctype, recommended first implementation behavior:

```txt
render application/x-www-form-urlencoded and include a safe form-level diagnostic only if diagnostics UI exists
```

Do not silently imply multipart/file support.

## Attribute policy

All attribute values must be escaped. Boolean attributes such as `required`, `multiple`, and `checked` should be rendered only when true and must not accept arbitrary raw strings.

## Deferred

- raw HTML bypass
- raw attribute injection
- arbitrary method support
- multipart/form-data
- custom escaping hooks
- sanitizer integration
- rich HTML help/error content

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
