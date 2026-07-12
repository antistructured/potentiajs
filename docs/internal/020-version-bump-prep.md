# 0.2.0 Version Bump Prep

## Previous version

```txt
0.2.0-preview.1
```

## Current version

```txt
0.2.0
```

## Files changed

- `package.json`
- `jsr.json`
- `docs/internal/020-version-bump-prep.md`

## Confirmation

Confirmed:

- `package.json` version is `0.2.0`
- `jsr.json` version is `0.2.0`
- versions match
- README reflects `0.2.0` final
- CHANGELOG has `0.2.0` final entry

Verification command:

```bash
node -e 'const p=require("./package.json"); const j=require("./jsr.json"); if (p.version !== j.version) throw new Error(`${p.version} !== ${j.version}`); const fs=require("fs"); const readme=fs.readFileSync("README.md","utf8"); const changelog=fs.readFileSync("CHANGELOG.md","utf8"); if (!readme.includes("Version: `0.2.0`")) throw new Error("README version missing"); if (!changelog.includes("## 0.2.0")) throw new Error("CHANGELOG final entry missing"); console.log(p.version)'
```

Result:

```txt
0.2.0
```

## Blockers

None.
