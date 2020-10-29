import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import html from "@open-wc/rollup-plugin-html";
import del from "rollup-plugin-delete";
import multiInput from "rollup-plugin-multi-input";
import { terser } from "rollup-plugin-terser";
import url from "url";
const pkg = require("./package.json");

let publicPath = "/";

function template({ bundle }) {
  return `<!DOCTYPE html>
<html>
  <head>
  <title>Solid - Hacker News</title>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="${publicPath}index.css" />
</head>
<body><script type="module" src="${bundle.entrypoints[0].importPath}"></script></body>
</html>`;
}

export default (config) => {
  config.configDeploy && (publicPath = url.parse(pkg.homepage).pathname);
  return {
    input: ["src/index.js", "src/pages/**/!(*.data.js)"],
    output: {
      dir: "public",
      format: "esm"
    },
    // preserveEntrySignatures: false,
    plugins: [
      del({
        targets: ["public/*", "!public/index.css"],
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
      html({
        inject: false,
        publicPath,
        template
      }),
      process.env.production && terser()
    ]
  }
}
