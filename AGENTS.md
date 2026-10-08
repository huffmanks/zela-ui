# Zela — Agent Instructions

Build **Zela**, a lightweight, accessible Web Component library for complex or non-native UI. Treat it as an extension of the web platform, not a framework.

## Priorities

- Prefer modern HTML, CSS, and browser APIs. Use TypeScript only where it adds value.
- Prefer native semantics over ARIA; use ARIA only when native HTML cannot express the required behavior.
- Account for keyboard use, focus management, screen readers, reduced motion, forced colors, disabled states, and form behavior.
- Keep solutions simple: avoid unnecessary dependencies, abstractions, files, and build infrastructure.
- Use standard Custom Elements and Shadow DOM where appropriate. Do not add a component framework unless a concrete need justifies it.
- Use the `zela-` custom-element prefix. Keep public APIs framework-agnostic.

## Repository Structure

This is a pnpm monorepo:

```text
apps/
  docs/                  # Documentation site and component playground
packages/
  ui/                    # Public Web Component library
    src/
      components/
        <component>/
          <component>.ts
          <component>.styles.ts
          <component>.test.ts
      declaration.d.ts
      main.ts
```

Keep each component's implementation, styles, and tests together. The directories below are optional and should be added only when there is a real need:

- `src/events/` — shared event definitions or event utilities
- `src/internal/` — shared private implementation details, such as validators, debounce, or DOM helpers
- `src/styles/` — shared global styling primitives, such as layers, themes, base styles, colors, variants, and utilities
- `src/utilities/` — functionality intended to be reusable beyond private implementation details

Do not create empty or speculative directories. Reorganize only when it makes the code simpler and easier to maintain.

## Component Workflow

For each component:

1. Confirm that native HTML/CSS does not already solve the problem adequately.
2. Define its behavior, semantics, accessibility, attributes, properties, events, slots, and CSS API.
3. Implement with platform features first and keep component-specific code colocated.
4. Add focused behavior and accessibility tests.
5. Demonstrate it in `apps/docs`, using the package's public API.
6. Verify relevant browser behavior and states.
7. Extract shared code only after real reuse appears.

Prefer Vitest for component tests and Playwright for real-browser tests. Use accessibility tooling where it adds useful coverage. Avoid redundant test infrastructure.

## Tooling and Configuration

The repository already has a pnpm workspace, TypeScript project references, ESLint, Prettier, Vitest, Playwright, and Changesets. Inspect and use the existing setup before proposing replacements.

**Protect the existing environment:**

- Do not install, uninstall, upgrade, downgrade, or replace packages without telling me first and getting approval.
- Do not change root-level or global configuration, workspace setup, shared tooling, scripts, or dependency versions just to tidy things up.
- If a concrete error or implementation requirement makes a package or configuration change necessary, explain the reason and intended change before proceeding. Make the smallest targeted fix; do not use it as an opportunity for unrelated cleanup.
- Never modify machine-wide/global settings or tools as part of routine project work.
- Prefer existing dependencies and scripts. Do not add a dependency when a small native solution is sufficient.

## Working Rules

- Inspect relevant source files and existing conventions before editing.
- Make focused, incremental changes; preserve unrelated work.
- Avoid speculative architecture and premature optimization.
- Do not remove tests, dependencies, or configuration merely because they appear redundant. Raise the concern first.
- Run the most relevant existing checks after changes and report what was run and any failures.
- Keep documentation and examples aligned with the actual public API.

When multiple solutions are viable, prefer native platform behavior, less code, fewer dependencies, fewer abstractions, and easier maintenance.
