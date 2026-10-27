import { defineConfig } from "vite";
import { resolve } from "node:path";

// The validation and helpers on their own, for servers that check what the
// component produced without loading Vue.
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/model/index.ts"),
      formats: ["es"],
      fileName: () => "model.js",
    },
  },
});
