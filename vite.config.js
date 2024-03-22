import { defineConfig } from "vite";
import { resolve } from "path";
export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        enter: resolve(__dirname, "enter.html"),
        registration: resolve(__dirname, "registration.html"),
        item: resolve(__dirname, "registration.html"),
      },
    },
  },
});
