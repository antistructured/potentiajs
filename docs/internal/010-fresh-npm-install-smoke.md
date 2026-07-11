# 0.1.0 Fresh npm Install Smoke

## Temp project

```txt
/tmp/potentia-010-install-smoke
```

## Commands run

```bash
rm -rf /tmp/potentia-010-install-smoke
mkdir /tmp/potentia-010-install-smoke
cd /tmp/potentia-010-install-smoke
npm init -y
npm install @potentiajs/core
npm ls @potentiajs/core
node smoke.mjs
```

## Install

Installed version:

```txt
0.1.0
```

`npm ls`:

```txt
potentia-010-install-smoke@1.0.0 /tmp/potentia-010-install-smoke
└── @potentiajs/core@0.1.0
```

CLI binary:

```txt
node_modules/.bin/potentia exists and is executable
```

## Imports

`node smoke.mjs`:

```json
{
  "version": "0.1.0",
  "rootImport": true,
  "fileRoutingImport": true,
  "formsImport": true,
  "rootHasGenerateFileRoutes": false,
  "rootHasRenderForm": false
}
```

Confirmed:

- root import works
- file-routing import works
- forms import works
- root remains unpolluted

## Blockers

None.
