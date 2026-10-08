# Zela UI

A modern, accessible web component library focused exclusively on components that are non-native.

## Structure

```
apps/
├── docs/
packages/
└── src/
    ├── components/
    │   └── combobox/
    │       ├── combobox.ts
    │       ├── combobox.styles.ts
    │       └── combobox.test.ts
    ├── declaration.d.ts
    ├── events/
    ├── internal/
    │   ├── validators/
    │   └── ...
    ├── styles/
    │   ├── layers/
    │   ├── themes/
    │   ├── base/
    │   ├── variants/
    │   ├── colors/
    │   └── utils/
    ├── utilities/
    └── main.ts
```

## Architecture

- **Platform-first**: prefer native HTML, `ElementInternals`, modern CSS
- **Lifecycle**: `UIElement` base class enforces `AbortController` cleanup
- **Styling**: base, themes, variants, layers, colors, utils.

## Verification Matrix

Every component passes:

1. Unit tests (Vitest)
2. Accessibility audits (axe-core)
3. Multi-browser E2E (Playwright: Chromium/Firefox/WebKit)
4. Visual regression snapshots
5. Consumer fixture verification (unbundled HTML)
