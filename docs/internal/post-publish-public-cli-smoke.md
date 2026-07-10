# Post-Publish Public CLI Smoke

## Temp project

```txt
/tmp/potentia-public-install-smoke
```

## Commands run

```bash
./node_modules/.bin/potentia routes check --json
./node_modules/.bin/potentia routes generate --json
./node_modules/.bin/potentia routes check --json
node app-smoke.mjs
```

## Route tree

```txt
routes/
  index.js
  users/
    [id].js
```

Route modules import from the installed public registry package:

```js
import { route, text, json } from '@potentiajs/core';
```

## Results

### First check

Exit:

```txt
1
```

Output:

```json
{
  "ok": false,
  "command": "routes check",
  "status": "missing",
  "root": "routes",
  "output": ".potentia/routes.generated.js",
  "package": "@potentiajs/core",
  "routes": 2,
  "scopes": 0,
  "diagnostics": [],
  "hint": "Run potentia routes generate"
}
```

Confirmed `.potentia/` was not created by missing check.

### Generate

Exit:

```txt
0
```

Output:

```json
{
  "ok": true,
  "command": "routes generate",
  "status": "generated",
  "root": "routes",
  "output": ".potentia/routes.generated.js",
  "package": "@potentiajs/core",
  "routes": 2,
  "scopes": 0,
  "diagnostics": []
}
```

Confirmed `.potentia/routes.generated.js` was created.

### Second check

Exit:

```txt
0
```

Output:

```json
{
  "ok": true,
  "command": "routes check",
  "status": "current",
  "root": "routes",
  "output": ".potentia/routes.generated.js",
  "package": "@potentiajs/core",
  "routes": 2,
  "scopes": 0,
  "diagnostics": []
}
```

### App smoke

Generated routes were imported into `createApp(...)` from the installed package.

Result:

```json
{
  "rootStatus": 200,
  "rootBody": "home",
  "userStatus": 200,
  "userBody": {
    "id": "ada"
  }
}
```

## Confirmed

- published CLI binary runs
- `routes check --json` reports missing without writing `.potentia/`
- `routes generate --json` writes generated routes
- second `routes check --json` reports current
- generated routes work in an app created from the registry-installed package

## Blockers

None.
