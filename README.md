# Civitai model downloader

___


## How to build

```
  ppm i
  pnpm run build:firefox
```

## Release

1. Update `version` in `package.json`
2. Update `CHANGELOG` in `src/lib/constants.ts` with the new version entry
3. Commit: `git commit -m "version X.Y.Z"`
4. Tag: `git tag vX.Y.Z`
5. Push: `git push origin main --tags`
6. Build packages: `pnpm build`
7. Upload `dist/chrome/*.zip` and `dist/firefox/*.zip` to the respective stores