import { hydrate } from "solid-js/web";
import App from "./app";

hydrate(() => <App />, document.getElementById("app"));

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`/sw.js`);
  });
}
