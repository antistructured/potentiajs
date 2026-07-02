// Experimental TypeScript declarations for potentiajs.
// PotentiaJS remains a plain JavaScript ESM package and has no stable public API yet.

export type MaybePromise<T> = T | PromiseLike<T>;
export type Handler = (context: RequestContext) => MaybePromise<unknown>;
export type EffectDescriptor = {
  kind: 'effect';
  fn: (...args: unknown[]) => Iterator<unknown> | AsyncIterator<unknown>;
  meta?: unknown;
};
export type RouteHandler = Handler | EffectDescriptor | ActionDescriptor;
export type Hook = Handler | EffectDescriptor;
export type Contract = unknown;
export type Metadata = Record<string, unknown>;

export interface RequestContext {
  request: Request;
  params: Record<string, string>;
  query: Record<string, string | string[] | undefined>;
  input?: unknown;
  meta?: Metadata;
  [key: string]: unknown;
}

export interface RouteOptions {
  params?: Contract;
  query?: Contract;
  body?: Contract;
  response?: Contract;
  hooks?: Hooks;
  name?: string;
  meta?: Metadata;
  source?: unknown;
  [key: string]: unknown;
}

export interface Hooks {
  beforeRequest?: Hook[];
  afterResponse?: Hook[];
  onError?: Hook[];
  [key: string]: Hook[] | undefined;
}

export interface RouteDescriptor {
  kind?: string;
  method: string;
  path: string;
  handler: RouteHandler;
  options?: RouteOptions;
  [key: string]: unknown;
}

export interface RoutesOptions {
  prefix?: string;
  routes?: RouteDescriptor[];
  hooks?: Hooks;
  params?: Contract;
  query?: Contract;
  body?: Contract;
  response?: Contract;
  meta?: Metadata;
  source?: unknown;
  [key: string]: unknown;
}

export interface RoutesDescriptor {
  kind?: string;
  prefix?: string;
  routes: RouteDescriptor[];
  options?: RoutesOptions;
  [key: string]: unknown;
}

export interface MountOptions {
  prefix?: string;
  hooks?: Hooks;
  meta?: Metadata;
  source?: unknown;
  [key: string]: unknown;
}

export interface AppOptions {
  routes?: Array<RouteDescriptor | RoutesDescriptor>;
  hooks?: Hooks;
  meta?: Metadata;
  [key: string]: unknown;
}

export interface App {
  fetch(request: Request): MaybePromise<Response>;
  routes?: unknown;
  [key: string]: unknown;
}

export interface ActionOptions {
  input?: Contract;
  output?: Contract;
  meta?: Metadata;
  source?: unknown;
  [key: string]: unknown;
}

export interface ActionDescriptor {
  kind?: string;
  id: string;
  handler: RouteHandler;
  options?: ActionOptions;
  [key: string]: unknown;
}

export interface ResultDescriptor<T = unknown> {
  ok: boolean;
  value?: T;
  error?: unknown;
  status?: number;
  [key: string]: unknown;
}

export interface ResponseDescriptor {
  kind?: string;
  body?: unknown;
  status?: number;
  headers?: HeadersInit;
  location?: string;
  [key: string]: unknown;
}

export interface EffectCommand {
  type: string;
  [key: string]: unknown;
}

export interface FormStateOptions {
  ok?: false;
  values?: unknown;
  error?: unknown;
  issues?: unknown[];
  sensitiveFields?: string[];
  [key: string]: unknown;
}

export interface ProjectionOptions {
  packageName?: string;
  packageVersion?: string;
  [key: string]: unknown;
}

export interface FrameworkErrorOptions {
  code?: string;
  message?: string;
  status?: number;
  boundary?: string;
  issues?: unknown[];
  cause?: unknown;
  [key: string]: unknown;
}

export function createApp(options?: AppOptions): App;
export function route(method: string, path: string, handler: RouteHandler, options?: RouteOptions): RouteDescriptor;
export function createRoutes(options?: RoutesOptions): RoutesDescriptor;
export function mount(routes: RoutesDescriptor | RouteDescriptor[], options?: MountOptions): RoutesDescriptor;
export function action(id: string, handler: RouteHandler, options?: ActionOptions): ActionDescriptor;

export function ok<T = unknown>(value?: T, status?: number): ResultDescriptor<T>;
export function fail(error?: unknown, status?: number): ResultDescriptor<never>;
export function json(body: unknown, init?: ResponseInit): ResponseDescriptor;
export function text(body: string, init?: ResponseInit): ResponseDescriptor;
export function redirect(location: string, status?: number): ResponseDescriptor;

export function effect(fn: (...args: unknown[]) => Iterator<unknown> | AsyncIterator<unknown>, meta?: unknown): EffectDescriptor;
export function call(fn: (...args: unknown[]) => unknown, ...args: unknown[]): EffectCommand;
export function value<T = unknown>(input: T): EffectCommand;
export function context(key?: string): EffectCommand;

export function createFormState(input?: FormStateOptions): unknown;
export function composeRoutes(input: unknown, options?: unknown): RouteDescriptor[];
export function createPlugin(plugin: unknown): unknown;

export function projectContract(contract: Contract, options?: ProjectionOptions): unknown;
export function projectRoute(route: RouteDescriptor, options?: ProjectionOptions): unknown;
export function projectRoutes(input: unknown, options?: ProjectionOptions): unknown;
export function projectAction(action: ActionDescriptor, options?: ProjectionOptions): unknown;
export function projectForm(action: ActionDescriptor, options?: ProjectionOptions): unknown;
export function createRouteManifest(input: unknown, options?: ProjectionOptions): unknown;
export function createFrameworkError(options?: FrameworkErrorOptions): Error & Record<string, unknown>;
