import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "es2019",
    outDir: "dist",
    rollupOptions: {
      input: {
        users: resolve(__dirname, "index.html"),
        item: resolve(__dirname, "item.html"),
        index: resolve(__dirname, "index.html"),
        enter: resolve(__dirname, "enter.html"),
        registration: resolve(__dirname, "registration.html"),
      },
    },
    esbuildOptions: {
      target: "es2019",
    },
  },
});
