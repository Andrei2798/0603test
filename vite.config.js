// import { defineConfig } from "vite";
// import { resolve } from "path";

// export default defineConfig({
//   build: {
//     target: "esnext",
//     outDir: "dist",
//     rollupOptions: {
//       input: {
//         // users: resolve("src/users.js"),
//         item: resolve("src/item.js"),
//         index: resolve("src/index.js"),
//         enter: resolve("src/enter.js"),
//         registration: resolve("src/registration.js"),
//       },
//     },
//     esbuildOptions: {
//       target: "esnext", // или "es2020"
//     },
//   },
// });

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
      },
    },
  },
});
