import { readFile } from 'node:fs/promises';

import { generateFileRoutes } from './file-routing.js';
import { generateFileRouteSource } from './dev/file-routing/writer.js';

export const USAGE = 'Usage: potentia routes <generate|check> [--root <dir>] [--out <file>] [--package <specifier>] [--cwd <dir>] [--json]';

const DEFAULT_OPTIONS = {
  root: 'routes',
  out: '.potentia/routes.generated.js',
  packageName: '@potentiajs/core',
  cwd: null,
  json: false
};

const FLAG_MAP = new Map([
  ['--root', 'root'],
  ['--out', 'out'],
  ['--package', 'packageName'],
  ['--cwd', 'cwd']
]);

export function parseArgs(args = []) {
  if (!Array.isArray(args)) {
    return usageError('arguments must be an array', { json: false, command: null });
  }

  const json = args.includes('--json');
  const [namespace, command, ...rest] = args;
  const resolvedCommand = namespace === 'routes' && ['generate', 'check'].includes(command) ? `routes ${command}` : null;

  if (namespace !== 'routes' || !['generate', 'check'].includes(command)) {
    return usageError('Expected `potentia routes <generate|check>`', { json, command: resolvedCommand });
  }

  const options = { ...DEFAULT_OPTIONS, json };

  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];

    if (arg === '--json') {
      options.json = true;
      continue;
    }

    const optionName = FLAG_MAP.get(arg);

    if (!optionName) {
      return usageError(arg?.startsWith('--') ? `unknown option: ${arg}` : `unexpected argument: ${arg}`, {
        json,
        command: resolvedCommand
      });
    }

    const value = rest[index + 1];
    if (!value || value.startsWith('--')) {
      return usageError(`${arg} requires a value`, { json, command: resolvedCommand });
    }

    options[optionName] = value;
    index += 1;
  }

  return {
    ok: true,
    command: resolvedCommand,
    options: {
      root: options.root,
      out: options.out,
      packageName: options.packageName,
      cwd: options.cwd,
      json: options.json
    }
  };
}

export async function main(args = [], io = {}) {
  const stdout = io.stdout || process.stdout;
  const stderr = io.stderr || process.stderr;
  const baseCwd = io.cwd || process.cwd();
  const parsed = parseArgs(args);

  if (!parsed.ok) {
    if (parsed.json) {
      writeJson(stdout, createInvalidUsageEnvelope(parsed.command));
      return 2;
    }
    writeLine(stderr, USAGE);
    writeLine(stderr, `Usage error: ${parsed.error}`);
    return 2;
  }

  const cwd = parsed.options.cwd || baseCwd;

  try {
    if (parsed.command === 'routes check') {
      return await runCheck(parsed.options, cwd, { stdout, stderr });
    }

    return await runGenerate(parsed.options, cwd, { stdout, stderr });
  } catch (error) {
    if (parsed.options.json) {
      writeJson(stdout, createJsonEnvelope({
        ok: false,
        command: parsed.command,
        status: 'failed',
        root: parsed.options.root,
        output: parsed.options.out,
        packageName: parsed.options.packageName,
        routes: 0,
        scopes: 0,
        diagnostics: [{
          code: 'POTENTIA_FILE_ROUTE_UNEXPECTED',
          message: safeErrorMessage(error)
        }]
      }));
      return 1;
    }
    writeLine(stderr, 'File route generation failed:');
    writeLine(stderr, `- POTENTIA_FILE_ROUTE_UNEXPECTED ${safeErrorMessage(error)}`);
    return 1;
  }
}

export async function checkFileRoutes(options = {}) {
  const expected = generateFileRouteSource({
    rootDir: options.rootDir,
    outputFile: options.outputFile,
    packageName: options.packageName,
    cwd: options.cwd
  });

  if (!expected.ok) {
    return {
      ...expected,
      ok: false,
      status: 'failed'
    };
  }

  let currentSource;
  try {
    currentSource = await readFile(expected.outputFile, 'utf8');
  } catch (error) {
    if (isMissingFileError(error)) {
      return {
        ok: false,
        status: 'missing',
        rootDir: expected.rootDir,
        outputFile: expected.outputFile,
        written: false,
        routes: expected.routes,
        scopes: expected.scopes,
        diagnostics: [],
        errors: []
      };
    }
    return {
      ok: false,
      status: 'failed',
      rootDir: expected.rootDir,
      outputFile: expected.outputFile,
      written: false,
      routes: expected.routes,
      scopes: expected.scopes,
      diagnostics: [{
        code: 'POTENTIA_FILE_ROUTE_READ_FAILED',
        message: 'Failed to read generated route module',
        outputFile: expected.outputFile,
        cause: error instanceof Error ? error.message : String(error)
      }],
      errors: [{
        code: 'POTENTIA_FILE_ROUTE_READ_FAILED',
        message: 'Failed to read generated route module',
        outputFile: expected.outputFile,
        cause: error instanceof Error ? error.message : String(error)
      }]
    };
  }

  const current = normalizeNewlines(currentSource);
  const generated = normalizeNewlines(expected.source);
  const currentStatus = current === generated ? 'current' : 'stale';

  return {
    ok: currentStatus === 'current',
    status: currentStatus,
    rootDir: expected.rootDir,
    outputFile: expected.outputFile,
    written: false,
    routes: expected.routes,
    scopes: expected.scopes,
    diagnostics: [],
    errors: []
  };
}

export function formatDiagnostic(diagnostic = {}) {
  const code = diagnostic.code || 'POTENTIA_FILE_ROUTE_FAILED';
  const location = diagnostic.filePath || diagnostic.relativePath || diagnostic.routePath || diagnostic.rootDir || diagnostic.outputFile || '';
  const message = diagnostic.message || 'File route generation failed';
  return location ? `- ${code} ${location} ${message}` : `- ${code} ${message}`;
}

export function createJsonEnvelope({
  ok,
  command,
  status,
  root,
  output,
  packageName,
  routes,
  scopes,
  diagnostics,
  hint
}) {
  const envelope = {
    ok: Boolean(ok),
    command,
    status,
    root,
    output,
    package: packageName,
    routes: Number.isFinite(routes) ? routes : 0,
    scopes: Number.isFinite(scopes) ? scopes : 0,
    diagnostics: toJsonDiagnostics(diagnostics)
  };

  if (hint) {
    envelope.hint = hint;
  }

  return envelope;
}

export function toJsonDiagnostics(diagnostics = []) {
  return diagnostics.map((diagnostic = {}) => {
    const jsonDiagnostic = {
      code: diagnostic.code || 'POTENTIA_CLI_ERROR',
      message: diagnostic.message || 'Unknown diagnostic'
    };
    const path = diagnostic.path || diagnostic.filePath || diagnostic.relativePath || diagnostic.routePath || diagnostic.rootDir || diagnostic.outputFile;
    if (path && !isAbsolutePath(path)) {
      jsonDiagnostic.path = path;
    }
    return jsonDiagnostic;
  });
}

async function runGenerate(options, cwd, io) {
  const result = await generateFileRoutes({
    rootDir: options.root,
    outputFile: options.out,
    packageName: options.packageName,
    cwd
  });

  if (!result.ok) {
    if (options.json) {
      writeJson(io.stdout, createJsonEnvelope({
        ok: false,
        command: 'routes generate',
        status: 'failed',
        root: options.root,
        output: options.out,
        packageName: options.packageName,
        routes: result.routes,
        scopes: result.scopes,
        diagnostics: result.errors?.length ? result.errors : result.diagnostics
      }));
      return 1;
    }
    writeDiagnostics(io.stderr, result);
    return 1;
  }

  if (options.json) {
    writeJson(io.stdout, createJsonEnvelope({
      ok: true,
      command: 'routes generate',
      status: 'generated',
      root: options.root,
      output: options.out,
      packageName: options.packageName,
      routes: result.routes,
      scopes: result.scopes,
      diagnostics: result.diagnostics
    }));
    return 0;
  }

  writeLine(io.stdout, 'Generated file routes:');
  writeLine(io.stdout, `- root: ${options.root}`);
  writeLine(io.stdout, `- output: ${options.out}`);
  writeLine(io.stdout, `- routes: ${result.routes}`);
  writeLine(io.stdout, `- scopes: ${result.scopes}`);
  return 0;
}

async function runCheck(options, cwd, io) {
  const result = await checkFileRoutes({
    rootDir: options.root,
    outputFile: options.out,
    packageName: options.packageName,
    cwd
  });

  if (options.json) {
    const status = result.status || (result.ok ? 'current' : 'failed');
    writeJson(io.stdout, createJsonEnvelope({
      ok: status === 'current',
      command: 'routes check',
      status,
      root: options.root,
      output: options.out,
      packageName: options.packageName,
      routes: result.routes,
      scopes: result.scopes,
      diagnostics: result.errors?.length ? result.errors : result.diagnostics,
      hint: ['missing', 'stale'].includes(status) ? 'Run potentia routes generate' : undefined
    }));
    return status === 'current' ? 0 : 1;
  }

  if (result.status === 'current') {
    writeLine(io.stdout, 'File routes are current:');
    writeLine(io.stdout, `- root: ${options.root}`);
    writeLine(io.stdout, `- output: ${options.out}`);
    writeLine(io.stdout, `- routes: ${result.routes}`);
    writeLine(io.stdout, `- scopes: ${result.scopes}`);
    return 0;
  }

  if (result.status === 'missing') {
    writeLine(io.stderr, 'File routes are not generated:');
    writeLine(io.stderr, `- output: ${options.out}`);
    writeLine(io.stderr, '- run: potentia routes generate');
    return 1;
  }

  if (result.status === 'stale') {
    writeLine(io.stderr, 'File routes are stale:');
    writeLine(io.stderr, `- output: ${options.out}`);
    writeLine(io.stderr, '- run: potentia routes generate');
    return 1;
  }

  writeDiagnostics(io.stderr, result);
  return 1;
}

function writeDiagnostics(stderr, result) {
  writeLine(stderr, 'File route generation failed:');
  const diagnostics = result.errors?.length ? result.errors : result.diagnostics || [];
  for (const diagnostic of diagnostics) {
    writeLine(stderr, formatDiagnostic(diagnostic));
  }
  if (diagnostics.length === 0) {
    writeLine(stderr, '- POTENTIA_FILE_ROUTE_FAILED File route generation failed');
  }
}

function usageError(error, options = {}) {
  return {
    ok: false,
    error,
    usage: USAGE,
    json: Boolean(options.json),
    command: options.command ?? null
  };
}

function createInvalidUsageEnvelope(command) {
  return {
    ok: false,
    command,
    status: 'invalid-usage',
    diagnostics: [{
      code: 'POTENTIA_CLI_INVALID_USAGE',
      message: USAGE
    }]
  };
}

function writeJson(stream, value) {
  writeLine(stream, JSON.stringify(value));
}

function writeLine(stream, line) {
  stream.write(`${line}\n`);
}

function safeErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function isMissingFileError(error) {
  return error?.code === 'ENOENT';
}

function normalizeNewlines(value) {
  return String(value).replace(/\r\n/g, '\n');
}

function isAbsolutePath(value) {
  return String(value).startsWith('/') || /^[A-Za-z]:[\\/]/.test(String(value));
}
