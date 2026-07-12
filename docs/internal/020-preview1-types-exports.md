# 0.2.0-preview.1 Types + Exports

## Files changed

- `src/html.d.ts`
- `docs/internal/020-preview1-types-exports.md`

## Types added

Added:

```ts
export interface PageOptions {
  title?: HtmlChild;
  lang?: string;
  head?: HtmlChild;
  body?: HtmlChild;
  children?: HtmlChild;
  htmlAttrs?: Record<string, unknown>;
  bodyAttrs?: Record<string, unknown>;
}

export type LayoutRenderer<Props extends Record<string, unknown> = Record<string, unknown>> =
  (props: Props) => HtmlChild;

export function layout<Props extends Record<string, unknown> = Record<string, unknown>>(
  render: LayoutRenderer<Props>
): (props?: Props) => HtmlValue;

export function page(options?: PageOptions): HtmlValue;
```

## Exports

No package metadata change is needed for preview.1 exports because the existing `./html` subpath already covers runtime and types:

- `package.json` export: `./html`
- `jsr.json` export: `./html`

Runtime exports from `src/html.js` now include:

- `html`
- `raw`
- `escapeHtml`
- `attrs`
- `fragment`
- `htmlResponse`
- `layout`
- `page`

## Root exports

No root exports were added. `page(...)` and `layout(...)` remain subpath-only through `@potentiajs/core/html`.

## Blockers

None.
