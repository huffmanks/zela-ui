import { describe, expect, it } from "vitest";
import "./combobox.js";

describe("combobox", () => {
  it("defines zela-combobox", () => {
    expect(customElements.get("zela-combobox")).toBeDefined();
  });
});
