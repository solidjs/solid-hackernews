import { renderToStringAsync } from "solid-js/web";
import { StartServer } from "solid-start/components";

export default async ({ request, manifest, headers, context = {} }) => {
  const html = await renderToStringAsync(() => (
    <StartServer context={context} url={request.url} manifest={manifest} />
  ));

  headers.set("Content-Type", "text/html");

  return new Response(html, {
    status: 200,
    headers,
  });
};
