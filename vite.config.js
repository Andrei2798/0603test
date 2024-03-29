import { defineConfig } from "vite";
import { resolve } from "path";
export default defineConfig({
  build: {
    target: "esnext",
    outDir: "dist",

    rollupOptions: {
      input: {
        item: resolve(__dirname, "item.html"),
        index: resolve(__dirname, "index.html"),
        enter: resolve(__dirname, "enter.html"),
        registration: resolve(__dirname, "registration.html"),
      },
      esbuildOptions: {
        target: "es2022", // Используйте целевую среду, поддерживающую top-level await
      },
    },
  },
});
