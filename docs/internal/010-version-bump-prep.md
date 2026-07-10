# 0.1.0 Version Bump Prep

## Previous version

```txt
0.1.0-preview.1
```

## Current version

```txt
0.1.0
```

## Files changed

- `package.json`
- `jsr.json`
- `docs/internal/010-version-bump-prep.md`

Earlier release-prep passes already updated:

- `README.md`
- `CHANGELOG.md`

## Version consistency

Verified with:

```bash
node -e 'const p=require("./package.json"); const j=require("./jsr.json"); if (p.version !== j.version) throw new Error(`${p.version} !== ${j.version}`); console.log(p.version)'
```

Result:

```txt
0.1.0
```

## README alignment

Confirmed:

- README references current version `0.1.0`
- README install examples use `npm install @potentiajs/core` and `bun add @potentiajs/core`
- README has no `0.1.0-preview` references

## CHANGELOG alignment

Confirmed:

- CHANGELOG has `## 0.1.0`
- preview history remains preserved below it

## Blockers

None.
