import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import manifest from "rollup-route-manifest";
import path from "path";

export default defineConfig({
  plugins: [
    solid({ ssr: true }),
    manifest({
      inline: false,
      merge: false,
      publicPath: "/assets/",
      routes: (file) => {
        file = file.replace(path.join(__dirname, "src"), "").replace(/\.[tj]sx?$/, "");
        if (!file.includes("/pages/")) return "*"; // commons
        let name = "/" + file.replace("/pages/", "").toLowerCase();
        return name === "/home" ? "/" : name;
      }
    })
  ],
  build: {
    polyfillDynamicImport: false,
    target: "esnext"
  }
});
