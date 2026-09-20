import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // relative base: works on GitHub Pages subpath, Cloudflare Pages root, anywhere
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        cv: "cv.html",
      },
    },
  },
});
