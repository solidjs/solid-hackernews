export function preload(handlers: { path: string }[], manifest: Record<string, [{ href: string }]>) {
  const url = handlers
    .map((h) =>
      h.path.replace(/:(\w+)/, (f, g) => `[${g}]`).replace(/\*(\w+)/, (f, g) => `[...${g}]`)
    )
    .join("");

  return (
    manifest[url] &&
    manifest[url]
      .slice(0) //clone
      .reverse()
      .slice(1)
      .map((m) => `<link rel="modulepreload" href="${m.href}" />`)
      .join("")
  );
}
