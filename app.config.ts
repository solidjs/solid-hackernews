import { defineConfig } from "@solidjs/start/config";

const baseURL = process.env.BASE_URL || "";

export default defineConfig({
  ssr: false,
  server: {
    preset: "github_pages",
    baseURL,
  },
});
