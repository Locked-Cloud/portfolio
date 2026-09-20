import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  testIgnore: /record\.spec\.ts|axe-dump\.spec\.ts|shot\.spec\.ts/, // dev tools — run on demand
  timeout: 30_000,
  retries: 0,
  reporter: "line",
  use: {
    baseURL: "http://localhost:4173",
  },
  webServer: {
    command: "npm run preview",
    port: 4173,
    reuseExistingServer: true,
  },
});
