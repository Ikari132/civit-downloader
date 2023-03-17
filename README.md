# Svelte browser extension template

### Instalation

```
pnpm i
```

### Development

In the first terminal run watch script:

```
pnpm watch
```

And then, in the second terminal run command to open browser with loaded extension:

```
pnpm open
```

### Testing

```
pnpm test
```

The script runs Playwright to execute end-to-end tests.

### Building

To build extension run:

```
pnpm build
```

You'll get zip archive with the extension in dist/chrome folder

### Linting

```
pnpm lint
```

The script runs ESLint to check for code quality in the src directory

```
pnpm lint:svelte
```

The script checks the Svelte components for any errors using the svelte-check tool.

### Assets

In the assets folder you can store extension screenshots(up to 5) and promo banners(in 3 sizes)
In *description.md* and *changelog.md* files you can store extension's 