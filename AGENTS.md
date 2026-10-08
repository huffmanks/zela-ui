# Zela Web Component Library — Architecture & Execution Directive

Build **Zela**, a modern, accessible Web Component library focused exclusively on components that are non-native or sufficiently complex to justify custom behavior.

The library should feel like an extension of the web platform, not a framework built on top of it.

All components use the `zela-` custom-element namespace:

```html
<zela-combobox></zela-combobox>
<zela-dialog></zela-dialog>
<zela-command-palette></zela-command-palette>
```

## Core Philosophy

### Platform first

Prefer native HTML, CSS, and browser APIs before introducing JavaScript abstractions.

Use modern platform capabilities such as:

- Custom Elements
- Shadow DOM
- `ElementInternals`
- Form-associated custom elements
- Popover API
- CSS Anchor Positioning
- Container queries
- CSS nesting
- `:has()`
- Native transitions and animations
- Modern focus and DOM APIs

Do not recreate functionality that HTML or CSS already provides well.

JavaScript should primarily provide behavior that the platform does not provide.

### Accessibility first

Accessibility is part of the component contract.

Prefer native semantics over ARIA. Use WAI-ARIA patterns only when native HTML cannot express the required interaction.

Every component should consider:

- Keyboard interaction
- Focus management
- Screen readers
- Reduced motion
- Forced colors/high contrast
- Disabled and unavailable states
- Form behavior
- Appropriate ARIA semantics

### Minimal abstraction

Do not build a framework.

Avoid unnecessary:

- Base classes
- State-management systems
- Component abstractions
- Lifecycle frameworks
- Utility packages
- Dependencies
- Build infrastructure

Use abstractions only when they solve a real recurring problem.

## Repository Structure

Use a pnpm monorepo with a single source package and colocated component implementation:

```text
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

This structure is a starting point, not a rigid requirement.

Use judgment continuously. Remove, rename, merge, or reorganize directories when doing so produces a simpler and more maintainable architecture.

### Component organization

Components are self-contained.

A component's implementation, styles, and tests should live together:

```text
components/
└── combobox/
    ├── combobox.ts
    ├── combobox.styles.ts
    └── combobox.test.ts
```

Do not create centralized component-style or component-test directories.

### Internal vs utilities

Use `internal/` for implementation details that are shared internally but are not part of the public API.

Examples:

- Validators
- Debouncing
- Internal DOM helpers
- Private state helpers

Use `utilities/` for genuinely reusable public or broadly applicable functionality.

### Events

Centralize shared custom-event definitions and event-related utilities when multiple components need them.

Events should have consistent naming, typing, and behavior.

Component-specific events remain conceptually owned by their component.

### Styles

Keep global styling primitives under `styles/`.

Possible areas include:

- Cascade layers
- Themes
- Base styles
- Colors
- Variants
- Utilities

Do not create a style category simply because it seems architecturally complete. Every directory should contain something that provides real value.

## Component Development

Develop one component at a time.

For every component:

1. Identify the problem it solves.
2. Identify the native HTML/CSS alternative.
3. Determine whether a custom element is justified.
4. Define its semantic and accessibility contract.
5. Define attributes, properties, events, slots, and CSS APIs.
6. Implement it using native platform capabilities.
7. Keep component-specific logic and styles local.
8. Add focused behavior and accessibility tests.
9. Add it to `apps/docs`.
10. Verify important browser and visual states.
11. Extract shared behavior only when real reuse appears.

## Testing

Use testing to validate behavior, accessibility, and browser compatibility.

Prefer:

- Vitest for component behavior
- axe-core for accessibility
- Playwright for real browser interaction
- Visual regression testing where it provides meaningful value

Do not create fixtures, test packages, snapshot systems, or additional testing infrastructure unless they solve an actual problem.

If an existing testing layer becomes redundant, remove it.

## Documentation

`apps/docs` is both the documentation site and development playground.

It should make it easy to:

- Develop components
- Interactively inspect components
- Test visual states
- Demonstrate accessibility behavior
- Document APIs
- Show usage examples

The docs should consume Zela through its public API rather than reaching into component internals.

## Public API

Components must work as standard Web Components:

```html
<zela-combobox></zela-combobox>
```

Prefer:

- Attributes
- Properties
- Custom events
- Slots
- CSS custom properties
- CSS parts where appropriate
- Native form behavior

Do not design the API around a particular JavaScript framework.

## Technology Decisions

Use TypeScript where it provides meaningful value.

Prefer native browser APIs over third-party libraries.

Use pnpm-workspace, tsconfig, eslint and prettier globally for all.

**Do not introduce Lit, React, Vue, or another component framework unless the project demonstrates a concrete problem that the framework solves better than native Web Components.**

The default implementation should use:

```text
Custom Elements
+ Shadow DOM where appropriate
+ native DOM APIs
+ modern CSS
+ TypeScript
```

Build tooling should compile and distribute standard Web Components rather than framework-specific components.

## Architectural Judgment

The proposed architecture is never authoritative.

The implementation agent should actively look for opportunities to simplify.

It is explicitly allowed to:

- Rename directories
- Merge directories
- Delete directories
- Move functionality
- Remove dependencies
- Replace abstractions with platform APIs
- Remove redundant tests
- Remove redundant fixtures
- Simplify build configuration
- Change the package structure

Do not preserve architecture simply because it appeared in this document.

When deciding between two viable approaches, prefer the one with:

1. Less code
2. Fewer dependencies
3. Fewer abstractions
4. Fewer files
5. More native platform behavior
6. Easier maintenance

## Execution Order

Work incrementally:

1. Inspect the repository and existing tooling.
2. Remove unnecessary or premature architecture.
3. Establish the minimal pnpm workspace.
4. Establish the build and test pipeline.
5. Establish the minimal global styles/events/utilities required.
6. Build one representative advanced component.
7. Validate accessibility and browser behavior.
8. Integrate it into `apps/docs`.
9. Reassess the architecture based on actual reuse.
10. Add additional components incrementally.
11. Add publishing/versioning infrastructure when justified.

**Do not optimize the architecture for hypothetical future components.**

Build the smallest system that can support the component being built today, while keeping the path open for proven reuse tomorrow.
