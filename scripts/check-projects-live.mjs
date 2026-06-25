const html = await fetch("https://gccreativehk.com/projects", {
  headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
}).then((r) => r.text());

// Deploy fingerprint
const hasBgStyle = html.includes("backgroundImage") || html.includes("is-hero-cover");
const hasPImgCover = html.includes("p-img-cover");
const heroChunk = html.match(/p-card hero[\s\S]{0,500}/)?.[0] ?? "no hero";
console.log("background-image inline?", hasBgStyle);
console.log("p-img-cover class?", hasPImgCover);
console.log("hero snippet:", heroChunk.slice(0, 400));

const cards = [...html.matchAll(/class="p-card([^"]*)"[\s\S]*?p-name">([^<]+)/g)];
console.log("\nCards:", cards.length);
for (const m of cards.slice(0, 12)) {
  const block = m[0];
  const name = m[2];
  const hero = block.includes("p-card hero");
  const bg = block.match(/background-image:\s*url\(([^)]+)\)/)?.[1];
  const src = block.match(/src="([^"]+)"/)?.[1];
  console.log(hero ? "HERO" : "card", name.trim(), bg || src || "NO IMG");
}
