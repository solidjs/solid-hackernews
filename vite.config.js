import { defineConfig } from "vite";
import solid from "solid-start";
import netlify from "solid-start-netlify";

export default defineConfig({
  plugins: [solid({ adapter: netlify({ edge: true }) })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
