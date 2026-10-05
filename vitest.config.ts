import { defineConfig } from "vitest/config";

/* unit tests for the pure tool logic live next to it in src/ — kept well away
   from the Playwright specs in tests/ (which use a different runner) */
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
