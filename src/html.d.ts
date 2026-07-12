export interface HtmlValue {
  toString(): string;
}

export type HtmlChild =
  | HtmlValue
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | HtmlChild[];

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

export function escapeHtml(value: unknown): string;
export function raw(value: unknown): HtmlValue;
export function html(strings: TemplateStringsArray, ...values: HtmlChild[]): HtmlValue;
export function fragment(...children: HtmlChild[]): HtmlValue;
export function layout<Props extends Record<string, unknown> = Record<string, unknown>>(
  render: LayoutRenderer<Props>
): (props?: Props) => HtmlValue;
export function attrs(attributes: Record<string, unknown> | null | undefined): HtmlValue;
export function htmlResponse(body?: HtmlChild, init?: ResponseInit): Response;
export function page(options?: PageOptions): HtmlValue;
