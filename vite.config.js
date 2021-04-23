import { defineConfig } from "vite";
import solid from "solid-start";
import cloudflare from "solid-start-cloudflare-workers";

export default defineConfig({
  plugins: [solid({ adapter: cloudflare() })],
  build: {
    polyfillDynamicImport: false,
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
