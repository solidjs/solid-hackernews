import { Suspense } from "solid-js";
import { isServer } from "solid-js/web";
import { Route } from "solid-app-router";
import Nav from "./components/nav";

export default function Layout({ App }) {
  return (
    <App>
      <Nav />
      <Suspense fallback={<div class="news-list-nav">Loading...</div>}>
        <Route />
      </Suspense>
    </App>
  );
}

if (import.meta.env.PROD && !isServer && "serviceWorker" in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`/sw.js`);
  });
}
