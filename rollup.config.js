import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import alias from "@rollup/plugin-alias";
import html from "@open-wc/rollup-plugin-html";
import del from "rollup-plugin-delete";
import { terser } from "rollup-plugin-terser";
import url from "url";
const pkg = require("./package.json");

let publicPath = "";

function template({ bundle }) {
  const chunks = Object.keys(bundle.bundle);
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Solid - Hacker News</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Hacker News Clone built with Solid">
    <link rel="stylesheet" href="${publicPath}/index.css" />
    <link rel="shortcut icon" href="${publicPath}/favicon.ico" />
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages
      // MIT License
      // https://github.com/rafgraph/spa-github-pages
      (function(l) {
        if (l.search[1] === '/' ) {
          var decoded = l.search.slice(1).split('&').map(function(s) {
            return s.replace(/~and~/g, '&')
          }).join('?');
          window.history.replaceState(null, null,
              l.pathname.slice(0, -1) + decoded + l.hash
          );
        }
      }(window.location))
    </script>
    <link rel="manifest" href="${publicPath}/manifest.webmanifest">
    <link rel="modulepreload" href="${chunks.find((s) => s.startsWith("[...stories]"))}" />
  </head>
  <body><script type="module" src="${bundle.entrypoints[0].importPath.slice(1)}"></script></body>
</html>`;
}

export default (config) => {
  config.configDeploy && (publicPath = url.parse(pkg.homepage).pathname);
  return {
    input: "src/index.jsx",
    output: {
      dir: "public",
      format: "esm"
    },
    preserveEntrySignatures: false,
    plugins: [
      del({
        targets: [
          "public/*",
          "!public/index.css",
          "!public/404.html",
          "!public/favicon.ico",
          "!public/robots.txt",
          "!public/manifest.webmanifest",
          "!public/img",
          "!public/sw.js"
        ],
        watch: true
      }),
      !process.env.production &&
        alias({
          entries: [{ find: /^solid-js$/, replacement: "solid-js/dev" }]
        }),
      resolve({ extensions: [".jsx", ".js"]}),
      babel({
        babelHelpers: "bundled",
        presets: ["solid"],
        plugins: ["@babel/syntax-dynamic-import", "@babel/plugin-proposal-optional-chaining"]
      }),
      replace({
        "process.env.PUBLIC_URL": JSON.stringify(publicPath)
      }),
      html({
        inject: false,
        publicPath,
        template
      }),
      // generateSW({
      //   swDest: 'public/sw.js',
      //   globDirectory: 'public/',
      // }),
      process.env.production &&
        terser({
          output: { comments: false }
        })
    ]
  };
};
