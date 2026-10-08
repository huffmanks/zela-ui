# Zela

A modern, accessible Web Component library built on native HTML, CSS, and browser APIs.

Zela focuses on components that are complex or not adequately provided by the web platform. It avoids recreating native HTML controls and minimizes JavaScript where the platform already provides a solution.

## Principles

- **Platform first** — Prefer native HTML, CSS, and browser APIs.
- **Accessible by default** — Accessibility is part of every component's API.
- **Minimal JavaScript** — Use TypeScript only where it provides real value.
- **Framework agnostic** — Components work as standard Web Components.
- **Simple architecture** — Favor fewer dependencies, abstractions, and moving parts.

## Structure

```text
apps/
└── docs/                  # Documentation and playground

packages/
└── ui/                    # Web Component library
    └── src/
        └── components/
            └── combobox/
                ├── combobox.ts
                ├── combobox.styles.ts
                └── combobox.test.ts
```

Components use the `zela-` custom-element prefix:

```html
<zela-combobox></zela-combobox>
```

## Development

Requires Node.js and pnpm.

```sh
pnpm install
pnpm dev
```

Run the full check suite:

```sh
pnpm check
```

Build the packages:

```sh
pnpm build
```

Run tests:

```sh
pnpm test
```

Run end-to-end tests:

```sh
pnpm e2e
```

## License

## License

[MIT](./LICENSE)
