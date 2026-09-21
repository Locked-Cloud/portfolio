/**
 * Generates public/rss.xml from the devlog posts in src/data/content.ts.
 * Runs as part of `npm run build` — the feed never drifts from the site.
 */
import { readFileSync, writeFileSync } from "node:fs";

const SITE = "https://locked-cloud.github.io/portfolio/";
const src = readFileSync("src/data/content.ts", "utf8");

const re =
  /slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*date:\s*"([^"]+)",\s*minutes:\s*(\d+),\s*excerpt:\s*("(?:[^"\\]|\\.)*"),/g;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const posts = [];
let m;
while ((m = re.exec(src)) !== null) {
  posts.push({
    slug: m[1],
    title: m[2],
    date: m[3],
    minutes: m[4],
    excerpt: JSON.parse(m[5]),
  });
}

if (posts.length === 0) {
  console.error("rss.mjs: no posts parsed — regex out of sync with content.ts");
  process.exit(1);
}

const items = posts
  .map(
    (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE}#post-${p.slug}</link>
      <guid isPermaLink="true">${SITE}#post-${p.slug}</guid>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(p.excerpt)} (${p.minutes} min read)</description>
    </item>`
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ibrahim@sys — devlog</title>
    <link>${SITE}#blog</link>
    <atom:link href="${SITE}rss.xml" rel="self" type="application/rss+xml"/>
    <description>How, not just what — a front-end engineer ships real-time 3D, SaaS on $0, and edge ML.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

writeFileSync("public/rss.xml", xml, "utf8");
console.log(`rss.mjs: wrote public/rss.xml — ${posts.length} posts`);
