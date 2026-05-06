import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("../src", import.meta.url).pathname.replace(
  /^\/([A-Za-z]:)/,
  "$1",
);

const legacyPatterns = [
  /text-gray-/,
  /text-slate-/,
  /text-\[rgb\(var\(--slate-(900|800|700)\)\)\]/,
  /text-(blue|green|red|orange|amber|emerald)-800/,
];

const standardChecks = [
  {
    name: "h1 sem page-title",
    pattern: /<h1\s+class="(?![^"]*\bpage-title\b)/,
  },
  {
    name: "th sem table-head-cell",
    pattern: /<th\s+class="(?![^"]*\btable-head-cell\b)/,
  },
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files);
    } else if (full.endsWith(".svelte")) {
      files.push(full);
    }
  }
  return files;
}

const rows = [];
const structural = [];

for (const file of walk(root)) {
  const rel = relative(process.cwd(), file);
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  let legacyCount = 0;

  lines.forEach((line, index) => {
    if (legacyPatterns.some((pattern) => pattern.test(line))) legacyCount += 1;

    for (const check of standardChecks) {
      if (check.pattern.test(line)) {
        structural.push({
          file: rel,
          line: index + 1,
          type: check.name,
          source: line.trim(),
        });
      }
    }
  });

  if (legacyCount > 0) rows.push({ file: rel, legacyCount });
}

rows.sort((a, b) => b.legacyCount - a.legacyCount);

console.log("Legacy typography/color references by file:");
for (const row of rows.slice(0, 30)) {
  console.log(`${String(row.legacyCount).padStart(3, " ")}  ${row.file}`);
}

console.log("\nStructural standard violations:");
if (structural.length === 0) {
  console.log("None");
} else {
  for (const item of structural) {
    console.log(`${item.file}:${item.line}  ${item.type}  ${item.source}`);
  }
}
