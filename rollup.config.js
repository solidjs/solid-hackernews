import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import del from "rollup-plugin-delete";
import multiInput from 'rollup-plugin-multi-input';
import { terser } from "rollup-plugin-terser";

const plugins = [
  del({
    targets: ["public/*", "!public/index.html", "!public/index.css"],
    watch: true
  }),
  resolve({ extensions: [".js", ".jsx"] }),
  multiInput(),
  babel({
    exclude: "node_modules/**",
    babelHelpers: "bundled",
    presets: ["solid"],
    plugins: ["@babel/syntax-dynamic-import", "@babel/plugin-proposal-optional-chaining"]
  }),
  process.env.production && terser()
];

export default {
  input: ["src/index.js", "src/pages/**/!(*.data.js)"],
  output: {
    dir: "public",
    format: "esm"
  },
  // preserveEntrySignatures: false,
  plugins
};
