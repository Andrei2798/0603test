import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "es2019",
    outDir: "dist",
    rollupOptions: {
      input: {
        item: resolve("src/item.js"),
        index: resolve("src/index.js"),
        enter: resolve("src/enter.js"),
        registration: resolve("src/registration.js"),
      },
    },
    esbuildOptions: {
      target: "es2019",
    },
  },
});
