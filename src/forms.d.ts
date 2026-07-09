export interface RenderFormOptions {
  action?: string;
  method?: string;
  state?: unknown;
  submitLabel?: string;
  idPrefix?: string;
}

export function renderForm(formProjection: unknown, options?: RenderFormOptions): string;
