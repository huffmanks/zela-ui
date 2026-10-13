# Zela UI --- Implementation Plan

## Goal

Build Zela UI, a lightweight, accessible, framework-agnostic Web
Component library for complex UI that native HTML and CSS do not already
provide adequately.

Treat the library as an extension of the web platform. Prefer modern
HTML, CSS, and browser APIs, using TypeScript where it provides clear
value. Do not recreate native controls without a concrete reason.

## Product Principles

- **Platform first:** Prefer native semantics, browser behavior, and
  standard Web Components.
- **Accessible by default:** Design keyboard interaction, focus
  management, screen-reader behavior, reduced motion, forced colors,
  disabled states, and form behavior into each component.
- **Framework agnostic:** Expose standard Custom Elements with
  HTML-friendly APIs; do not require a UI framework.
- **Small by default:** Avoid unnecessary dependencies, abstractions,
  configuration, and JavaScript.
- **Customizable:** Provide documented CSS customization points and
  theming without requiring consumers to adopt a framework.
- **Incremental architecture:** Extract shared code only after
  concrete reuse or a clear cross-component requirement appears.

## Non-Negotiable Working Rules

- Inspect the relevant source, tests, configuration, and package
  scripts before making changes.
- Preserve existing user work and unrelated project conventions.
- Do not install, uninstall, upgrade, downgrade, or replace
  dependencies without first explaining the reason and getting
  approval.
- Do not change root-level or global configuration, workspace setup,
  shared tooling, scripts, or dependency versions for cleanup alone.
- If a concrete error or implementation requirement makes a package or
  configuration change necessary, explain the reason and intended
  change before proceeding. Make only the smallest approved change.
- Never modify machine-wide tools or settings as part of routine
  project work.
- Do not remove tests, dependencies, or configuration merely because
  they appear redundant. Raise the concern first.
- Prefer existing project scripts and tooling. Do not assume a tool is
  installed because an earlier plan mentions it; verify the current
  manifests and configuration.
- Make focused, incremental changes. Avoid speculative architecture
  and broad rewrites.
- Run the relevant existing checks and report exactly what ran and any
  failures.
- Keep documentation and examples aligned with the implemented public
  API.

## Repository Context

This is a pnpm workspace using Vite+ (`vp`). The current repository
snapshot shows:

- `packages/ui/` --- the Web Component library.
- `apps/docs/` --- the documentation site and component playground.
- `packages/ui/src/components/<component>/` --- component
  implementation, styles, and tests colocated by component.
- `packages/ui/src/index.ts` --- the library entry point shown in the
  snapshot.
- `packages/ui/src/declaration.d.ts` --- declaration support.
- `packages/ui/src/events/`, `internal/`, `styles/`, and `utils/` ---
  optional shared areas; add content only when there is a concrete
  need.

Use the actual package names, exports, scripts, and current source tree
as the source of truth. Do not rely on stale paths or assumptions in
this document when the repository differs.

## Component Conventions

### Naming and registration

- Use the `zu-` custom-element prefix consistently.
- Use standard Custom Elements and register elements through the
  library's public entry point in a predictable way.
- Avoid duplicate-registration errors when the same module is
  evaluated more than once; inspect the existing registration approach
  before changing it.
- Keep the public API framework-agnostic.

### DOM and lifecycle

- Choose Shadow DOM selectively. Use it when encapsulation materially
  improves component correctness or maintainability; prefer light DOM
  when it better supports semantics, styling, or integration.
- Follow platform lifecycle callbacks and clean up event listeners,
  observers, timers, and other resources when an element disconnects
  or is reconfigured.
- Prefer native HTML semantics and controls inside components where
  practical.
- Do not add a framework or a base class solely to standardize code
  that is already simple.

### Public API

- Define each component's supported attributes, properties, events,
  slots, parts, and CSS custom properties before implementation.
- Use attributes for appropriate declarative string/boolean
  configuration and properties for richer values or property-only
  state. Keep attribute/property reflection behavior deliberate and
  documented.
- Use typed TypeScript APIs where they improve consumer ergonomics,
  without making TypeScript a runtime requirement.
- Use standard DOM events with documented names, bubbling, and
  composition behavior appropriate to the component.
- Avoid redundant ways to configure the same behavior.
- Preserve normal browser behavior and form integration unless the
  component has a clear reason to differ.

### Styling and theming

- Use a hybrid CSS approach: shared tokens and layers where they
  provide genuine cross-component value, with component-specific
  styles colocated with the component.
- Keep shared styles small and stable; do not create a comprehensive
  design system before real needs are established.
- Use CSS custom properties for supported theming and customization
  points.
- For Shadow DOM components, deliberately document which styles are
  encapsulated and which customization points are exposed, such as CSS
  custom properties and `::part()`.
- Respect reduced-motion preferences and forced-colors/high-contrast
  modes where applicable.
- Avoid global resets or styles that unexpectedly alter consumer
  pages.

### Forms

- Prefer native form controls and browser form behavior where
  practical.
- When a custom element must participate directly in form submission,
  validation, disabled state, or reset behavior, evaluate
  form-associated custom elements and `ElementInternals`.
- Do not build a shared form-control abstraction until multiple
  components demonstrate a common, necessary requirement.
- Test form value, validity, disabled behavior, and reset behavior for
  components that participate in forms.

## Component Workflow

For each component:

1.  **Validate the need.** Confirm that native HTML/CSS does not already
    solve the use case adequately.
2.  **Inspect the repository.** Read related components, utilities,
    styles, tests, package exports, and docs before deciding on an
    approach.
3.  **Specify the contract.** Define use cases, semantics, interaction
    model, attributes, properties, events, slots, CSS API, form
    behavior, and accessibility requirements.
4.  **Implement the smallest complete version.** Prefer platform
    features, colocated implementation, and the existing project
    conventions.
5.  **Test behavior.** Cover important states, keyboard interactions,
    focus, lifecycle cleanup, attribute/property behavior, and relevant
    accessibility requirements.
6.  **Verify in a browser when needed.** Use the project's existing
    browser-test setup if available. Do not add or replace tooling
    without approval.
7.  **Document the public API.** Add an example to `apps/docs/` using
    the public package API rather than private source imports.
8.  **Run checks.** Use existing package scripts and relevant workspace
    checks; report failures without concealing or working around them.
9.  **Extract shared code only when justified.** Require demonstrated
    reuse or a clear platform-level need.

A component is not complete merely because it renders. Its public API,
key interactions, accessibility behavior, tests, documentation example,
and relevant checks must be addressed.

## Initial Milestone: Combobox

Use the existing combobox as the first reference implementation. Do not
rewrite it blindly.

1.  Inspect `combobox.ts`, `combobox.styles.ts`, `combobox.test.ts`, the
    public entry point, declaration file, docs app, and current
    test/build configuration.
2.  Summarize the current implementation, behavior, known gaps, and any
    decisions that would affect other components.
3.  Compare the implementation against the component workflow and
    accessibility requirements.
4.  Propose the smallest set of changes needed to make the combobox a
    reliable reference component.
5.  Wait for approval before changes that require dependency, workspace,
    root/global configuration, or shared-tooling modifications.
6.  Implement in small slices, maintaining existing conventions unless a
    specific issue justifies a change.
7.  Add or update docs and tests, then run the existing relevant checks.

Do not use the combobox to justify generalized infrastructure unless
another concrete use case needs it.

## Testing and Accessibility

- First inspect the testing tools and scripts actually configured in
  the repository.
- Prefer focused tests for observable behavior over tests coupled to
  implementation details.
- Cover keyboard operation, focus movement, open/close behavior,
  selection, disabled and empty states, relevant ARIA state,
  attribute/property changes, and lifecycle cleanup as applicable.
- Include real-browser coverage for behavior that a DOM emulator
  cannot reliably verify, especially focus, browser integration,
  Shadow DOM, and layout-dependent interactions, if the existing setup
  supports it.
- Use existing accessibility tooling where available. Manual reasoning
  and tests should still verify the intended interaction model; an
  automated scan alone is not proof of accessibility.
- Do not claim full accessibility or browser support based only on
  unit tests.
- Avoid redundant test infrastructure and do not introduce new testing
  dependencies without approval.

## Tooling and Validation

- Treat the current `package.json` files, `pnpm-workspace.yaml`,
  TypeScript configuration, Vite+ configuration, and lockfile as
  authoritative.
- Use the repository's configured `vp` commands and package scripts
  after confirming their actual behavior.
- Do not assume that scripts such as `check`, `test`, `build`, or
  `e2e` exist at the root or in every package.
- Do not migrate away from Vite+ or alter package-manager, dependency,
  linting, formatting, build, or TypeScript configuration as part of
  ordinary component work.
- If validation fails, identify whether the cause is in the change,
  the existing environment, or an unrelated baseline issue before
  proposing a fix.

## Documentation

Document each public component with:

- Purpose and when to use it instead of native platform features.
- Basic HTML example.
- Supported attributes and properties, including defaults and
  reflection behavior.
- Events and their payloads and propagation behavior.
- Slots, CSS custom properties, and Shadow DOM parts where applicable.
- Keyboard interaction and accessibility notes.
- Form behavior, where applicable.
- Important browser support requirements or limitations.

Keep examples concise and runnable in the docs app.

## Definition of Done

A change is ready when:

- It solves a defined use case that native platform features do not
  already adequately cover.
- The public API is intentional, typed where useful, and documented.
- Semantics, keyboard interaction, focus, and relevant
  assistive-technology behavior are addressed.
- Lifecycle resources are cleaned up correctly.
- Relevant behavior and accessibility tests are present.
- The docs example uses the public API and matches actual behavior.
- Relevant existing checks have been run and their results reported.
- No unapproved dependency, global, root configuration, or
  shared-tooling changes were made.

## Open Decisions Before Broader Implementation

Resolve these questions before establishing a larger component roadmap:

1.  **Browser support:** What is the minimum supported browser/version
    baseline?
2.  **Styling delivery:** Should consumers import a shared stylesheet
    for tokens/layers, or should each component work with no global
    stylesheet by default?
3.  **Registration and imports:** Should importing the package entry
    point automatically register every component, or should consumers be
    able to import/register components individually?
4.  **Component roadmap:** After the combobox, which specific non-native
    components are the highest priority?

Until these are answered, keep the work focused on auditing and
improving the existing combobox. Avoid making broad compatibility,
distribution, or roadmap assumptions.
