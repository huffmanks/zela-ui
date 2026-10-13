export const comboboxStyles = `
:host {
  --zu-combobox-border: var(--zu-color-border, #8b8b8b);
  --zu-combobox-background: var(--zu-color-surface, Canvas);
  --zu-combobox-color: var(--zu-color-text, CanvasText);
  --zu-combobox-focus: var(--zu-color-focus, Highlight);
  --zu-combobox-radius: var(--zu-radius-control, 0.375rem);
  --zu-combobox-max-height: 16rem;
  --zu-combobox-height: 2.5rem;
  --zu-combobox-padding: 0.5rem 0.75rem;

  position: relative;
  display: inline-block;
  min-width: 12rem;
  color: var(--zu-combobox-color);
  font: inherit;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

:host([size="sm"]) {
  --zu-combobox-height: 2rem;
  --zu-combobox-padding: 0.25rem 0.5rem;
}

:host([size="lg"]) {
  --zu-combobox-height: 3rem;
  --zu-combobox-padding: 0.75rem 1rem;
}

.control {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
  min-height: var(--zu-combobox-height);
  border: 1px solid var(--zu-combobox-border);
  border-radius: var(--zu-combobox-radius);
  background: var(--zu-combobox-background);
}

.control:focus-within {
  outline: 2px solid var(--zu-combobox-focus);
  outline-offset: 2px;
}

.input {
  width: 100%;
  min-width: 0;
  min-height: calc(var(--zu-combobox-height) - 2px);
  padding: var(--zu-combobox-padding);
  border: 0;
  outline: 0;
  background: transparent;
  color: inherit;
  font: inherit;
}

.input:focus-visible {
  outline: none;
}

.clear {
  flex: none;
  padding: 0.375rem;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.clear:focus-visible {
  outline: 2px solid var(--zu-combobox-focus);
  outline-offset: -2px;
}

:host(:not([clearable])) .clear,
:host([disabled]) .clear {
  display: none;
}

:host([disabled]) .control {
  opacity: 0.6;
}

:host([disabled]) .input,
:host([disabled]) .clear {
  cursor: not-allowed;
}

.listbox {
  position: absolute;
  z-index: 1;
  inset-inline: 0;
  top: calc(100% + 0.25rem);
  max-height: var(--zu-combobox-max-height);
  overflow: auto;
  margin: 0;
  padding: 0.25rem;
  border: 1px solid var(--zu-combobox-border);
  border-radius: var(--zu-combobox-radius);
  background: var(--zu-combobox-background);
  color: var(--zu-combobox-color);
  box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 12%);
}

.listbox[hidden],
[hidden] {
  display: none !important;
}

.option {
  padding: 0.5rem 0.625rem;
  border-radius: calc(var(--zu-combobox-radius) / 2);
  cursor: pointer;
}

.option[aria-selected="true"],
.option[data-active="true"] {
  background: Highlight;
  color: HighlightText;
}

.option[aria-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.55;
}

.group-label {
  padding: 0.5rem 0.625rem 0.25rem;
  color: GrayText;
  font-size: 0.875em;
  font-weight: 600;
}

.empty {
  padding: 0.5rem 0.625rem;
  color: GrayText;
}

@media (forced-colors: active) {
  .control:focus-within {
    outline-color: Highlight;
  }

  .option[aria-selected="true"],
  .option[data-active="true"] {
    outline: 1px solid Highlight;
  }
}
`;
