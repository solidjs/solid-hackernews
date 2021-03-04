import path from "path";
import express from "express";
import { readFileSync } from "fs";
import { ViteDevServer } from "vite";
import { preload } from "./src/utils/preload";
import { renderToNodeStream } from "solid-js/web";

async function createServer(root = process.cwd(), isProd = process.env.NODE_ENV === "production") {
  const resolve = (p: string) => path.resolve(__dirname, p);
  const indexProd = isProd ? readFileSync(resolve("dist/client/index.html"), "utf-8") : "";
  const manifest = isProd ? JSON.parse(readFileSync(resolve("dist/client/rmanifest.json"), "utf-8")) : "";

  const app = express();
  const ctx: { router?: any } = {};

  let vite: ViteDevServer;

  if (!isProd) {
    vite = await require("vite").createServer({
      root,
      logLevel: "info",
      server: {
        middlewareMode: true
      }
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    app.use(require("serve-static")(resolve("dist/client"), { index: false }));
  }

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;
      // HACK: Temprorary hacky fix
      if (url === "/favicon.ico") return res.send("");

      let template: string;
      let render: (ur: string, ctx: any) => ReturnType<typeof renderToNodeStream>;

      if (!isProd) {
        // always read fresh template in dev
        template = readFileSync(resolve("index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
      } else {
        template = indexProd;
        render = require("./dist/server/entry-server.js").render;
      }

      const { stream, script } = render(url, ctx);

      const [htmlStart, htmlEnd] = template
        .replace(`<!--app-head-->`, script)
        .replace(`<!--app-preload-->`, isProd ? preload(ctx.router[0].current, manifest) || "" :  manifest)
        .split(`<!--app-html-->`);

      res.status(200).set({ "content-type": "text/html" });

      res.write(htmlStart);
      stream.pipe(res, { end: false });

      stream.on("end", () => {
        res.write(htmlEnd);
        res.end();
      });
    } catch (e) {
      vite && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return { app, vite };
}

createServer().then(({ app }) =>
  app.listen(3000, () => {
    console.log("http://localhost:3000");
  })
);
