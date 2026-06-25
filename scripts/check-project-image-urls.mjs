const html = await fetch("https://gccreativehk.com/projects", {
  headers: { "Cache-Control": "no-cache" },
}).then((r) => r.text());

const imgs = [...html.matchAll(/<img[^>]+>/g)].filter((m) => m[0].includes("p-img"));
console.log("img tags:", imgs.length);
for (const m of imgs.slice(0, 15)) {
  const tag = m[0];
  const src = tag.match(/src="([^"]+)"/)?.[1];
  const alt = tag.match(/alt="([^"]+)"/)?.[1];
  const cls = tag.match(/class="([^"]+)"/)?.[1];
  let status = "?";
  if (src) {
    status = await fetch(`https://gccreativehk.com${src}`, { method: "HEAD" }).then((r) => r.status);
  }
  console.log(status, cls, alt, src);
}
