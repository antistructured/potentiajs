# 0.1.0 Public CLI + Generated Routes Smoke

## Temp project

```txt
/tmp/potentia-010-install-smoke
```

## Commands run

```bash
./node_modules/.bin/potentia routes check --json
./node_modules/.bin/potentia routes generate --json
./node_modules/.bin/potentia routes check --json
node app-smoke.mjs
```

## CLI

First check before generation:

```txt
exit: 1
status: missing
hint: Run potentia routes generate
```

Generate:

```txt
exit: 0
status: generated
routes: 2
```

Second check after generation:

```txt
exit: 0
status: current
routes: 2
```

Generated file:

```txt
.potentia/routes.generated.js exists
```

## Generated routes

Route tree:

```txt
routes/
  index.js
  users/
    [id].js
```

Route files import from final public package:

```js
import { route, text, json } from '@potentiajs/core';
```

## App smoke

`node app-smoke.mjs` result:

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

- final npm-installed CLI binary works
- `routes check --json` works
- `routes generate --json` works
- generated routes import from `@potentiajs/core`
- generated routes work through `createApp(...)`

## Blockers

None.
