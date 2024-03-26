import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "esnext",
    outDir: "dist",
    rollupOptions: {
      input: {
        index: resolve("src/users.js"),
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
