# Post-Publish Fresh npm Install Smoke

## Temp project

```txt
/tmp/potentia-public-install-smoke
```

## Commands run

```bash
rm -rf /tmp/potentia-public-install-smoke
mkdir -p /tmp/potentia-public-install-smoke
cd /tmp/potentia-public-install-smoke
npm init -y
npm install @potentiajs/core@preview
npm ls @potentiajs/core
ls node_modules/.bin/potentia
```

## Results

### Installed package

```txt
potentia-public-install-smoke@1.0.0 /tmp/potentia-public-install-smoke
└── @potentiajs/core@0.1.0-preview.0
```

### Binary

```txt
node_modules/.bin/potentia: present
```

### Installed package metadata

```json
{
  "name": "@potentiajs/core",
  "version": "0.1.0-preview.0",
  "bin": {
    "potentia": "./bin/potentia.js"
  }
}
```

## Confirmed

- fresh npm install from public registry works
- `@potentiajs/core@preview` resolves to `0.1.0-preview.0`
- installed package name is `@potentiajs/core`
- installed package exposes the `potentia` binary
- install used the registry package, not local tarball/workspace import

## Blockers

None.
