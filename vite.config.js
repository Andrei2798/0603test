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
import { copy } from "vite-plugin-copy"; // Импортируем функцию copy из плагина

export default defineConfig({
  plugins: [
    copy({
      targets: [{ src: "images", dest: "dist/images" }], // Копируем папку images из корня проекта в папку dist/images
      verbose: true, // Опционально: выводить подробные сообщения о копировании
    }),
  ],
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
        target: "es2022",
      },
    },
  },
});
