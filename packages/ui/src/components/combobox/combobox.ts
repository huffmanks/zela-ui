import { comboboxStyles } from "./combobox.styles.ts";

type ComboboxOption = {
  value: string;
  label: string;
  disabled: boolean;
  groupLabel: string;
  selected: boolean;
  source: HTMLOptionElement;
};

let nextComboboxId = 0;

export class Combobox extends HTMLElement {
  static formAssociated = true;
  static observedAttributes = [
    "disabled",
    "required",
    "placeholder",
    "label",
    "value",
    "name",
    "multiple",
    "clearable",
    "size",
  ];

  readonly #internals: ElementInternals | undefined;
  readonly #input: HTMLInputElement;
  readonly #selectedValues: HTMLDivElement;
  readonly #listbox: HTMLDivElement;
  readonly #optionsSlot: HTMLSlotElement;
  readonly #clearButton: HTMLButtonElement;

  #values = new Set<string>();
  #activeIndex = -1;
  #open = false;
  #querying = false;
  #formDisabled = false;

  constructor() {
    super();

    this.#internals = this.attachInternals?.();

    const root = this.attachShadow({ mode: "open" });
    const id = `zu-combobox-${++nextComboboxId}`;

    root.innerHTML = `
      <style>${comboboxStyles}</style>
      <div class="control" part="control">
        <div class="selected-values" part="selected-values"></div>
        <input
          class="input"
          part="input"
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="false"
          aria-controls="${id}-listbox"
          autocomplete="off"
        >
        <button class="clear" part="clear-button" type="button" aria-label="Clear selection" hidden>×</button>
      </div>
      <div
        class="listbox"
        part="listbox"
        id="${id}-listbox"
        role="listbox"
        hidden
      ></div>
      <slot hidden></slot>
    `;

    this.#input = root.querySelector<HTMLInputElement>("input")!;
    this.#selectedValues = root.querySelector<HTMLDivElement>(".selected-values")!;
    this.#listbox = root.querySelector<HTMLDivElement>(".listbox")!;
    this.#clearButton = root.querySelector<HTMLButtonElement>(".clear")!;
    this.#optionsSlot = root.querySelector<HTMLSlotElement>("slot")!;

    this.#input.addEventListener("input", this.#onInput);
    this.#input.addEventListener("keydown", this.#onKeyDown);
    this.#selectedValues.addEventListener("click", this.#onSelectedValueClick);
    this.#input.addEventListener("focus", this.#onFocus);
    this.#input.addEventListener("blur", this.#onBlur);
    this.#listbox.addEventListener("mousedown", this.#onOptionMouseDown);
    this.#listbox.addEventListener("click", this.#onOptionClick);
    this.#clearButton.addEventListener("click", this.#onClear);
    this.#optionsSlot.addEventListener("slotchange", this.#onOptionsChange);
  }

  connectedCallback() {
    this.#syncAttributes();
    this.#syncOptions();

    const initialValue = this.getAttribute("value");
    const selectedValues =
      initialValue !== null
        ? initialValue.split(",").filter(Boolean)
        : this.#allOptions()
            .filter((option) => option.selected)
            .map((option) => option.value);

    this.#setValues(selectedValues, false);
  }

  disconnectedCallback() {
    this.#close();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue || !this.#input) return;

    this.#syncAttributes();

    if (name === "value") {
      this.#setValues(
        newValue === null
          ? this.#allOptions()
              .filter((option) => option.selected)
              .map((option) => option.value)
          : newValue.split(",").filter(Boolean),
        false
      );
      return;
    }

    if (name === "disabled" && newValue !== null) this.#close();

    if (name === "multiple" && newValue === null && this.#values.size > 1) {
      this.#setValues([this.#values.values().next().value!], false);
    }

    this.#syncOptions();
    this.#renderOptions();
    this.#syncClearButton();
    this.#showSelectedLabels();
  }

  formAssociatedCallback() {
    this.#syncFormValue();
  }

  formDisabledCallback(disabled: boolean) {
    this.#formDisabled = disabled;
    this.#input.disabled = disabled || this.disabled;
    this.#clearButton.disabled = disabled || this.disabled;
    if (this.#input.disabled) this.#close();
  }

  formResetCallback() {
    this.#setValues(
      this.getAttribute("value")?.split(",").filter(Boolean) ??
        this.#allOptions()
          .filter((option) => option.selected)
          .map((option) => option.value),
      false
    );
  }

  formStateRestoreCallback(state: string | File | FormData | null) {
    if (typeof state === "string") {
      this.#setValues(state.split(",").filter(Boolean), false);
    }
  }

  get value(): string | string[] {
    return this.multiple ? [...this.#values] : (this.#values.values().next().value ?? "");
  }

  set value(value: string | string[]) {
    this.#setValues(Array.isArray(value) ? value : [String(value ?? "")], true);
  }

  get multiple() {
    return this.hasAttribute("multiple");
  }

  set multiple(value: boolean) {
    this.toggleAttribute("multiple", Boolean(value));
  }

  get clearable() {
    return this.hasAttribute("clearable");
  }

  set clearable(value: boolean) {
    this.toggleAttribute("clearable", Boolean(value));
  }

  get size(): "sm" | "default" | "lg" {
    const value = this.getAttribute("size");
    return value === "sm" || value === "lg" ? value : "default";
  }

  set size(value: "sm" | "default" | "lg") {
    if (value === "default") this.removeAttribute("size");
    else this.setAttribute("size", value);
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", Boolean(value));
  }

  get required() {
    return this.hasAttribute("required");
  }

  set required(value: boolean) {
    this.toggleAttribute("required", Boolean(value));
  }

  focus(options?: FocusOptions) {
    this.#input.focus(options);
  }

  #onInput = () => {
    this.#querying = true;
    this.#activeIndex = -1;

    if (!this.multiple) {
      this.#values.clear();
      this.#syncFormValue();
      this.#clearButton.hidden = !this.clearable;
    }

    this.#openList();
    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  };

  #onFocus = () => {
    if (this.disabled || this.#formDisabled) return;

    this.#querying = false;
    if (!this.multiple) this.#input.value = "";
    this.#openList();
  };

  #onBlur = () => {
    queueMicrotask(() => {
      if (this.shadowRoot?.activeElement === this.#input) return;

      this.#close();
      this.#querying = false;
      if (this.multiple) this.#input.value = "";
      this.#showSelectedLabels();
    });
  };

  #onKeyDown = (event: KeyboardEvent) => {
    if (this.disabled || this.#formDisabled) return;

    const options = this.#filteredOptions();
    if (event.key !== "Escape" && !options.some((option) => !option.disabled)) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      this.#openList();
      this.#moveActive(event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (event.key === "Home" && this.#open) {
      event.preventDefault();
      this.#setActive(0);
      return;
    }

    if (event.key === "End" && this.#open) {
      event.preventDefault();
      this.#setActive(options.length - 1);
      return;
    }

    if (event.key === "Enter" && this.#open && this.#activeIndex >= 0) {
      event.preventDefault();
      const option = options[this.#activeIndex];
      if (option) this.#selectOption(option);
      return;
    }

    if (event.key === "Escape" && this.#open) {
      event.preventDefault();
      this.#close();
      this.#querying = false;
      if (this.multiple) this.#input.value = "";
      this.#showSelectedLabels();
    }
  };

  #onOptionMouseDown = (event: MouseEvent) => {
    event.preventDefault();
  };

  #onOptionClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const element = target.closest<HTMLElement>("[data-option-index]");
    if (!element) return;

    const option = this.#filteredOptions()[Number(element.dataset.optionIndex)];
    if (!option || option.disabled) return;

    this.#selectOption(option);
    this.#input.focus();
  };

  #onSelectedValueClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest<HTMLButtonElement>("[data-remove-value]");
    if (!button || this.disabled || this.#formDisabled) return;

    const value = button.dataset.removeValue;
    if (value === undefined) return;

    this.#setValues(
      [...this.#values].filter((item) => item !== value),
      true
    );
    this.#input.focus();
  };

  #onClear = () => {
    if (this.disabled || this.#formDisabled) return;

    this.#setValues([], true);
    this.#querying = false;
    this.#input.value = "";
    this.#openList();
    this.#input.focus();
  };

  #onOptionsChange = () => {
    this.#syncOptions();
    this.#renderOptions();
  };

  #syncAttributes() {
    this.#input.disabled = this.disabled || this.#formDisabled;
    this.#clearButton.disabled = this.disabled || this.#formDisabled;
    this.#input.placeholder = this.getAttribute("placeholder") ?? "";
    this.#input.setAttribute("aria-label", this.getAttribute("label") ?? "Choose an option");
    this.#input.setAttribute("aria-disabled", String(this.#input.disabled));
    this.#input.setAttribute("aria-required", String(this.required));
    this.#listbox.setAttribute("aria-multiselectable", String(this.multiple));
    this.#clearButton.hidden = !this.clearable || this.#values.size === 0;
    this.#showSelectedLabels();
  }

  #allOptions(): ComboboxOption[] {
    return Array.from(this.querySelectorAll("option")).map((source) => {
      const group = source.closest("optgroup");

      return {
        value: source.value,
        label: source.label || source.textContent?.trim() || source.value,
        disabled: source.disabled || group?.disabled === true,
        groupLabel: group?.label ?? "",
        selected: source.defaultSelected,
        source,
      };
    });
  }

  #selectedLabels() {
    const values = this.#values;
    return this.#allOptions()
      .filter((option) => values.has(option.value))
      .map((option) => option.label);
  }

  #showSelectedLabels() {
    if (!this.multiple) {
      this.#input.value = this.#selectedLabels()[0] ?? "";
      return;
    }

    this.#selectedValues.replaceChildren();

    for (const option of this.#allOptions().filter((item) => this.#values.has(item.value))) {
      const chip = document.createElement("span");
      chip.className = "selected-value";
      chip.setAttribute("part", "selected-value");
      chip.append(document.createTextNode(option.label));

      if (!this.disabled && !this.#formDisabled) {
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-value";
        remove.setAttribute("part", "remove-value");
        remove.setAttribute("aria-label", `Remove ${option.label}`);
        remove.dataset.removeValue = option.value;
        remove.textContent = "×";
        chip.append(remove);
      }

      this.#selectedValues.append(chip);
    }
  }

  #filteredOptions() {
    const options = this.#allOptions();
    if (!this.#querying) return options;

    const query = this.#input.value.trim().toLocaleLowerCase();
    if (!query) return options;

    return options.filter((option) => option.label.toLocaleLowerCase().includes(query));
  }

  #syncOptions() {
    const options = this.#allOptions();
    const validValues = new Set(options.map((option) => option.value));

    this.#values = new Set([...this.#values].filter((value) => validValues.has(value)));
    this.#syncFormValue();
    this.#syncClearButton();
    this.#renderOptions();
  }

  #renderOptions() {
    const options = this.#filteredOptions();
    this.#listbox.replaceChildren();

    if (!options.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "No results";
      empty.setAttribute("role", "status");
      this.#listbox.append(empty);
      this.#activeIndex = -1;
      this.#input.removeAttribute("aria-activedescendant");
      return;
    }

    let previousGroup = "";

    options.forEach((option, index) => {
      if (option.groupLabel && option.groupLabel !== previousGroup) {
        const groupLabel = document.createElement("div");
        groupLabel.className = "group-label";
        groupLabel.textContent = option.groupLabel;
        groupLabel.setAttribute("aria-hidden", "true");
        this.#listbox.append(groupLabel);
      }

      previousGroup = option.groupLabel;

      const element = document.createElement("div");
      element.className = "option";
      element.dataset.optionIndex = String(index);
      element.id = `${this.#listbox.id}-option-${index}`;
      element.setAttribute("role", "option");
      element.setAttribute("aria-selected", String(this.#values.has(option.value)));
      element.setAttribute("aria-disabled", String(option.disabled));
      element.textContent = option.label;
      this.#listbox.append(element);
    });

    this.#setActive(this.#activeIndex, false);
  }

  #openList() {
    if (this.disabled || this.#formDisabled) return;

    this.#open = true;
    this.#listbox.hidden = false;
    this.#input.setAttribute("aria-expanded", "true");
    this.#renderOptions();
  }

  #close() {
    this.#open = false;
    this.#listbox.hidden = true;
    this.#input.setAttribute("aria-expanded", "false");
    this.#input.removeAttribute("aria-activedescendant");
    this.#activeIndex = -1;
  }

  #moveActive(direction: number) {
    const options = this.#filteredOptions();
    if (!options.some((option) => !option.disabled)) return;

    let index = this.#activeIndex < 0 ? (direction > 0 ? -1 : 0) : this.#activeIndex;

    for (let step = 0; step < options.length; step++) {
      index = (index + direction + options.length) % options.length;
      if (!options[index]!.disabled) {
        this.#setActive(index);
        return;
      }
    }
  }

  #setActive(index: number, scroll = true) {
    const options = this.#filteredOptions();

    if (index === -1) {
      this.#activeIndex = -1;
      this.#input.removeAttribute("aria-activedescendant");
      this.#listbox.querySelectorAll<HTMLElement>("[data-option-index]").forEach((element) => {
        delete element.dataset.active;
      });
      return;
    }

    if (index < 0 || index >= options.length || options[index]?.disabled) {
      const direction = index < 0 ? 1 : -1;
      let candidate = Math.max(0, Math.min(index, options.length - 1));

      while (candidate >= 0 && candidate < options.length && options[candidate]?.disabled) {
        candidate += direction;
      }

      if (candidate < 0 || candidate >= options.length || !options[candidate]) {
        this.#activeIndex = -1;
        this.#input.removeAttribute("aria-activedescendant");
        return;
      }

      index = candidate;
    }

    this.#activeIndex = index;

    const renderedOptions = this.#listbox.querySelectorAll<HTMLElement>("[data-option-index]");
    renderedOptions.forEach((element) => {
      const isActive = Number(element.dataset.optionIndex) === index;
      element.dataset.active = String(isActive);

      if (isActive) {
        this.#input.setAttribute("aria-activedescendant", element.id);
        if (scroll) element.scrollIntoView({ block: "nearest" });
      }
    });
  }

  #selectOption(option: ComboboxOption) {
    if (option.disabled) return;

    if (this.multiple) {
      if (this.#values.has(option.value)) this.#values.delete(option.value);
      else this.#values.add(option.value);

      this.#querying = true;
      this.#input.value = "";
      this.#activeIndex = -1;
      this.#showSelectedLabels();
      this.#syncFormValue();
      this.#renderOptions();
      this.#syncClearButton();
      this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
      this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
      return;
    }

    this.#setValues([option.value], true);
    this.#querying = false;
    this.#input.value = option.label;
    this.#close();
  }

  #setValues(values: string[], notify: boolean) {
    const options = this.#allOptions();
    const validValues = new Set(options.map((option) => option.value));
    const nextValues = values.filter((value) => validValues.has(value));
    this.#values = new Set(this.multiple ? nextValues : nextValues.slice(0, 1));

    this.#syncFormValue();
    this.#syncClearButton();

    if (this.multiple) {
      this.#input.value = this.#querying ? this.#input.value : "";
      this.#showSelectedLabels();
    } else {
      this.#input.value = this.#selectedLabels()[0] ?? "";
    }

    this.#renderOptions();

    if (notify) {
      this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
      this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    }
  }

  #syncClearButton() {
    this.#clearButton.hidden = !this.clearable || this.#values.size === 0;
    this.#showSelectedLabels();
  }

  #syncFormValue() {
    const name = this.getAttribute("name");

    if (!name) {
      this.#internals?.setFormValue(null);
    } else if (this.multiple) {
      const formValue = new FormData();
      for (const value of this.#values) formValue.append(name, value);
      this.#internals?.setFormValue(
        this.#values.size ? formValue : null,
        [...this.#values].join(",")
      );
    } else {
      const value = this.#values.values().next().value ?? "";
      this.#internals?.setFormValue(value || null, value);
    }

    if (this.required && this.#values.size === 0) {
      this.#internals?.setValidity({ valueMissing: true }, "Choose an option.", this.#input);
      return;
    }

    this.#internals?.setValidity({});
  }
}

if (!customElements.get("zu-combobox")) {
  customElements.define("zu-combobox", Combobox);
}
