import { defineConfig } from "vite";
import solid from "solid-start";
import netlify from "solid-start-netlify";

export default defineConfig({
  plugins: [solid({ adapter: netlify() })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
