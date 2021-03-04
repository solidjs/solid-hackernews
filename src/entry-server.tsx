import { renderToNodeStream } from "solid-js/web";
import App from "./app";
import fetch from "node-fetch";

globalThis.fetch = fetch;

export function render(initialURL: string, ctx: { router?: any }) {
  return renderToNodeStream(() => <App initialURL={initialURL} out={ctx} />);
}
