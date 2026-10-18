// Build-time guard: every literal t(dict, "a.b.c") key used in src/**/*
// must exist in dictionaries/fr.json. Wired as `check` + `prebuild` so a
// broken key fails the Vercel build instead of rendering an empty string.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const srcDir = join(root, "src");
const dictPath = join(root, "dictionaries", "fr.json");

function hasKey(obj, key) {
  return key.split(".").reduce((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) return acc[part];
    return undefined;
  }, obj) !== undefined;
}

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    // Test files intentionally reference missing keys; skip them.
    // Test files intentionally reference missing keys; skip them.
    if (full.includes("__tests__") || /\.test\.tsx?$/.test(full)) return [];
    return /\.(ts|tsx)$/.test(entry) ? [full] : [];
  });
}

const dict = JSON.parse(readFileSync(dictPath, "utf8"));
const pattern = /\bt\(\s*[^,()]+,\s*["']([a-zA-Z0-9_.]+)["']/g;
const missing = [];

for (const file of walk(srcDir)) {
  const text = readFileSync(file, "utf8");
  text.split("\n").forEach((line, i) => {
    for (const match of line.matchAll(pattern)) {
      const key = match[1];
      if (!hasKey(dict, key)) missing.push(`Missing i18n key: ${key} in ${relative(root, file)}:${i + 1}`);
    }
  });
}

if (missing.length > 0) {
  console.error(missing.join("\n"));
  process.exit(1);
}
console.log("check-i18n: all keys resolved");
