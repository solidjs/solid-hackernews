import { renderToNodeStream } from "solid-js/web";
import App from "./app";
import fetch from "node-fetch";

globalThis.fetch = fetch;

export function render(initialURL: string) {
  return renderToNodeStream(() => <App initialURL={initialURL} />);
}
