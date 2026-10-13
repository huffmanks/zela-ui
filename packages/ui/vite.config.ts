import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["src/index.ts"],
    deps: {
      resolveDepSubpath: true,
    },
    dts: true,
    exports: true,
  },
  test: {
    environment: "happy-dom",
  },
});
