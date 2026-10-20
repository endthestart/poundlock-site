// Copy the product repositories' Markdown into the site, so each guide has one
// source: the repository it documents. Run from the site root:
//
//   POUNDLOCK_SRC=../poundlock TOOLKIT_SRC=../poundlock-toolkit node scripts/sync-docs.mjs
//
// Without those variables it reads .sources/<repo>, where the deploy workflow
// checks them out. Each page gets its title from its first heading; links to other
// synced pages become site links, and links to anything else go to GitHub.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, normalize, posix } from "node:path";

const BASE = "/poundlock-site";
const OUT = "src/content/docs";

const products = [
  {
    repo: "poundlock",
    root: process.env.POUNDLOCK_SRC || ".sources/poundlock",
    pages: [
      ["README.md", "poundlock/index.md", { title: "Poundlock", label: "Overview", order: 0 }],
      ["docs/guide/getting-started.md", "poundlock/getting-started.md", { order: 1 }],
      ["docs/guide/machines.md", "poundlock/machines.md", { order: 2 }],
      ["docs/guide/integrations.md", "poundlock/integrations.md", { order: 3 }],
      ["docs/guide/jobs.md", "poundlock/jobs.md", { order: 4 }],
      ["docs/guide/litellm.md", "poundlock/litellm.md", { order: 5 }],
      ["docs/guide/operations.md", "poundlock/operations.md", { order: 6 }],
      ["docs/linux-node.md", "poundlock/linux-node.md", { order: 7 }],
      ["docs/node-update-signing.md", "poundlock/node-update-signing.md", { order: 8 }],
      ["CHANGELOG.md", "poundlock/changelog.md", { title: "Poundlock changelog", label: "Changelog", order: 9 }],
      ["ROADMAP.md", "roadmap.md", { title: "Roadmap" }],
    ],
  },
  {
    repo: "poundlock-toolkit",
    root: process.env.TOOLKIT_SRC || ".sources/poundlock-toolkit",
    pages: [
      ["README.md", "toolkit/index.md", { title: "Poundlock Toolkit", label: "Overview", order: 0 }],
      ...[
        "METHOD",
        "TARGETS",
        "STANDALONE",
        "SUPPORT",
        "OPERATIONS",
        "METHODOLOGY",
        "TOOL_SCHEMA",
        "SPEC",
        "SOURCE",
        "FIELD-NOTES",
      ].map((name, index) => [
        `docs/${name}.md`,
        `toolkit/${name.toLowerCase().replaceAll("_", "-")}.md`,
        { order: index + 1 },
      ]),
      ["CHANGELOG.md", "toolkit/changelog.md", { title: "Toolkit changelog", label: "Changelog", order: 20 }],
    ],
  },
];

// Every synced page by repository and source path, for rewriting links.
const sitePath = new Map();
for (const product of products)
  for (const [source, target] of product.pages)
    sitePath.set(`${product.repo}:${source}`, `${BASE}/${target.replace(/(index)?\.md$/, "")}`);

function rewrite(target, product, source) {
  if (/^([a-z]+:|#|\/)/i.test(target)) return target;
  const [path, anchor] = target.split("#");
  const resolved = normalize(posix.join(dirname(source), decodeURI(path))).replaceAll("\\", "/");
  const page = sitePath.get(`${product.repo}:${resolved}`);
  if (page) return page.replace(/\/?$/, "/") + (anchor ? `#${anchor}` : "");
  if (resolved.startsWith("..")) return target;
  const kind = /\.(png|jpe?g|gif|svg|webp)$/i.test(resolved) ? "raw" : "blob";
  const url =
    kind === "raw"
      ? `https://raw.githubusercontent.com/endthestart/${product.repo}/main/${resolved}`
      : `https://github.com/endthestart/${product.repo}/blob/main/${resolved}`;
  return url + (anchor ? `#${anchor}` : "");
}

function convert(text, product, source, meta) {
  const lines = text.split("\n");
  let title = meta.title;
  let fenced = false;
  const out = [];
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    if (!fenced && title === undefined && /^# /.test(line)) {
      title = line.slice(2).trim();
      continue;
    }
    if (!fenced && meta.title && out.length === 0 && /^# /.test(line)) continue;
    if (fenced) {
      out.push(line);
      continue;
    }
    out.push(
      line
        .replace(/(\]\()([^)\s]+)(\))/g, (_, open, target, close) => open + rewrite(target, product, source) + close)
        .replace(/^(\[[^\]]+\]:\s*)(\S+)/, (_, label, target) => label + rewrite(target, product, source)),
    );
  }
  const front = [
    "---",
    `title: ${JSON.stringify(title ?? source)}`,
    `editUrl: https://github.com/endthestart/${product.repo}/edit/main/${source}`,
    ...(meta.label || meta.order !== undefined ? ["sidebar:"] : []),
    ...(meta.label ? [`  label: ${JSON.stringify(meta.label)}`] : []),
    ...(meta.order !== undefined ? [`  order: ${meta.order}`] : []),
    "---",
    "",
  ];
  return front.join("\n") + out.join("\n").replace(/^\n+/, "");
}

for (const dir of ["poundlock", "toolkit"]) rmSync(join(OUT, dir), { recursive: true, force: true });
rmSync(join(OUT, "roadmap.md"), { force: true });
for (const product of products) {
  if (!existsSync(product.root)) throw new Error(`${product.repo} not found at ${product.root}`);
  for (const [source, target, meta] of product.pages) {
    const from = join(product.root, source);
    if (!existsSync(from)) throw new Error(`${product.repo}/${source} is missing`);
    const to = join(OUT, target);
    mkdirSync(dirname(to), { recursive: true });
    writeFileSync(to, convert(readFileSync(from, "utf8"), product, source, meta));
  }
}
const count = readdirSync(join(OUT, "poundlock")).length + readdirSync(join(OUT, "toolkit")).length + 1;
console.log(`synced ${count} pages`);
