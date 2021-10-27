import { defineConfig } from "vite";
import solid from "solid-start";
import vercel from "solid-start-vercel-edge";

export default defineConfig({
  plugins: [solid({ adapter: vercel() })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
