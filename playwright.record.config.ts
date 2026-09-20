import { defineConfig } from "@playwright/test";

// Records docs/demo.webm — a guided terminal session for the README.
// Run: npm run record:demo  → video lands in test-results/demo-record/*.webm
export default defineConfig({
  testDir: "tests",
  testMatch: /record\.spec\.ts|shot\.spec\.ts/,
  timeout: 120_000,
  reporter: "line",
  use: {
    baseURL: "http://localhost:4173",
    viewport: { width: 1280, height: 720 },
    launchOptions: { slowMo: 120 },
    video: "on",
  },
  webServer: {
    command: "npm run preview",
    port: 4173,
    reuseExistingServer: true,
  },
});
