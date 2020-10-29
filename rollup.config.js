import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
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
    <!-- Start Single Page Apps for GitHub Pages -->
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages
      // MIT License
      // https://github.com/rafgraph/spa-github-pages
      // This script checks to see if a redirect is present in the query string,
      // converts it back into the correct url and adds it to the
      // browser's history using window.history.replaceState(...),
      // which won't cause the browser to attempt to load the new url.
      // When the single page app is loaded further down in this file,
      // the correct url will be waiting in the browser's history for
      // the single page app to route accordingly.
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
    <!-- End Single Page Apps for GitHub Pages -->
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
        targets: ["public/*", "!public/index.css", "!public/404.html"],
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
      replace({
        "process.env.PUBLIC_URL": JSON.stringify(publicPath)
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
