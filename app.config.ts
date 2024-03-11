import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    preset: "cloudflare_module",
    rollupConfig: {
      external: ["node:async_hooks", "__STATIC_CONTENT_MANIFEST"]
    }
  },
});
