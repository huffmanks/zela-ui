import { describe, expect, it } from "vite-plus/test";
import "./combobox.ts";

describe("combobox", () => {
  it("defines zu-combobox", () => {
    expect(customElements.get("zu-combobox")).toBeDefined();
  });
});
