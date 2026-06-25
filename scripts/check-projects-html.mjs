const html = await fetch("https://gccreativehk.com/projects", {
  headers: { "Cache-Control": "no-cache" },
}).then((r) => r.text());

const idx = html.indexOf("Shenzhen hilltop villa");
console.log(html.slice(idx - 350, idx + 120));

const idx2 = html.indexOf("Stone mist diffuser");
console.log("\n--- stone mist ---\n");
console.log(html.slice(idx2 - 350, idx2 + 120));
