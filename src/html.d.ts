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

export function escapeHtml(value: unknown): string;
export function raw(value: unknown): HtmlValue;
export function html(strings: TemplateStringsArray, ...values: HtmlChild[]): HtmlValue;
export function fragment(...children: HtmlChild[]): HtmlValue;
export function attrs(attributes: Record<string, unknown> | null | undefined): HtmlValue;
export function htmlResponse(body?: HtmlChild, init?: ResponseInit): Response;
