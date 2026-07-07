// Experimental TypeScript declarations for @potentiajs/core/file-routing.
// File routing is a dev/build-time projection API. It does not perform runtime request-time filesystem scanning.

export interface FileRouteDiagnostic {
  code: string;
  message: string;
  filePath?: string;
  relativePath?: string;
  routePath?: string;
  files?: string[];
  rootDir?: string;
  outputFile?: string;
  cause?: string;
  [key: string]: unknown;
}

export interface GenerateFileRoutesOptions {
  rootDir: string;
  outputFile: string;
  packageName?: string;
  cwd?: string;
}

export interface GenerateFileRoutesResult {
  ok: boolean;
  rootDir: string | null;
  outputFile: string | null;
  written: boolean;
  source: string;
  routes: number;
  scopes: number;
  diagnostics: FileRouteDiagnostic[];
  errors: FileRouteDiagnostic[];
}

export function generateFileRoutes(options: GenerateFileRoutesOptions): Promise<GenerateFileRoutesResult>;
