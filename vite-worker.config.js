import nodeResolve from "@rollup/plugin-node-resolve";
import common from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import ignoreImport from 'rollup-plugin-ignore-import';

export default {
  input: "src/entry-worker.jsx",
  output: [
    {
      dir: "./dist/worker",
      format: "cjs"
    }
  ],
  external: ["stream"],
  treeshake: {
    moduleSideEffects: "no-external"
  },
  plugins: [
    nodeResolve({
      extensions: [".tsx", ".ts", ".jsx", ".js"],
      exportConditions: ["node", "solid"]
    }),
    ignoreImport({
      extensions: ['.scss', '.css']
    }),
    json(),
    babel({
      extensions: [".tsx", ".ts", ".jsx", ".js"],
      babelHelpers: "bundled",
      presets: [["@babel/preset-env",  { targets: { node: "10" } }], ["solid", { generate: "ssr", hydratable: true }], "@babel/preset-typescript"],
    }),
    common()
  ],
  preserveEntrySignatures: false
};
