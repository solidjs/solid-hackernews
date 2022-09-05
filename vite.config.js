import { defineConfig } from "vite";
import solid from "solid-start/vite";
import netlify from "solid-start-netlify";

export default defineConfig({
  plugins: [solid({ adapter: netlify() })]
});
