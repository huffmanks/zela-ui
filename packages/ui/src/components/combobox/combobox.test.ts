import { afterEach, describe, expect, it } from "vite-plus/test";
import { Combobox } from "./combobox.ts";

afterEach(() => {
  document.body.replaceChildren();
});

describe("zu-combobox", () => {
  it("registers the custom element", () => {
    expect(customElements.get("zu-combobox")).toBe(Combobox);
  });

  it("exposes the selected option value", () => {
    const element = document.createElement("zu-combobox");
    element.innerHTML = `
      <option value="alpha">Alpha</option>
      <option value="beta">Beta</option>
    `;
    document.body.append(element);

    element.value = "beta";

    expect(element.value).toBe("beta");
    expect(element.shadowRoot?.querySelector("input")?.value).toBe("Beta");
  });

  it("reflects disabled state to its internal input", () => {
    const element = document.createElement("zu-combobox");
    document.body.append(element);

    element.disabled = true;

    expect(element.hasAttribute("disabled")).toBe(true);
    expect(element.shadowRoot?.querySelector("input")?.disabled).toBe(true);
  });

  it("filters options as the user types", () => {
    const element = document.createElement("zu-combobox");
    element.innerHTML = `
      <option value="alpha">Alpha</option>
      <option value="beta">Beta</option>
    `;
    document.body.append(element);

    const input = element.shadowRoot?.querySelector<HTMLInputElement>("input");
    expect(input).toBeDefined();
    input!.value = "bet";
    input!.dispatchEvent(new Event("input", { bubbles: true }));

    expect(element.shadowRoot?.querySelectorAll('[role="option"]')).toHaveLength(1);
    expect(element.shadowRoot?.querySelector('[role="option"]')?.textContent).toBe("Beta");
  });
});
