import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ["src"],
      exclude: ["src/dev/**"],
      tsconfigPath: resolve(__dirname, "tsconfig.json"),
      processor: "vue",
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueLabelsetEditor",
      fileName: "vue-labelset-editor",
    },
    rollupOptions: {
      external: ["vue"],
      output: { globals: { vue: "Vue" } },
    },
  },
});
