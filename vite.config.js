import { defineConfig } from "vite";
import { resolve } from "path";
export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        // enter: resolve(__dirname, "static/enter.html"),
        main: resolve(__dirname, "static/registration.html"),
      },
    },
  },
});
