import { execSync } from "node:child_process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/* build provenance — the footer stamps every deploy with date · commit */
function buildStamp(): string {
  const date = new Date().toISOString().slice(0, 10);
  try {
    const hash = execSync("git rev-parse --short HEAD", { stdio: ["pipe", "pipe", "ignore"] })
      .toString()
      .trim();
    return `${date} · ${hash}`;
  } catch {
    return date;
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __BUILD_STAMP__: JSON.stringify(buildStamp()),
  },
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
