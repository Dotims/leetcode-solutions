#!/usr/bin/env node
/**
 * Regenerates the auto-managed sections of README.md:
 *   - the Progress Statistics table  (between <!-- STATS:START --> / <!-- STATS:END -->)
 *   - the Solutions index            (between <!-- SOLUTIONS:START --> / <!-- SOLUTIONS:END -->)
 *
 * It counts one problem per sub-folder of each difficulty directory and reads the
 * "Problem: <n>. <title>" header from each solution file. Run with `node .github/scripts/update-readme.mjs`.
 * The GitHub Action runs this on every push; you normally never need to run it by hand.
 */
import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";

const README = "README.md";

const DIFFICULTIES = [
  { dir: "Easy", emoji: "🟢", label: "Easy" },
  { dir: "Medium", emoji: "🟡", label: "Medium" },
  { dir: "Hard", emoji: "🔴", label: "Hard" },
];

/** List immediate sub-directories of `dir`, sorted. Returns [] if `dir` is missing. */
function subDirs(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
  } catch {
    return [];
  }
}

/** Find the first "solution*" file in a problem folder (falls back to any file). */
function solutionFile(folder) {
  const files = readdirSync(folder, { withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .sort();
  return files.find((f) => f.toLowerCase().startsWith("solution")) ?? files[0] ?? null;
}

/** Title-case a slug like "two-sum" -> "Two Sum" (fallback when no header is present). */
function titleFromSlug(slug) {
  return slug
    .replace(/^\d+-/, "")
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Read "Problem: 26. Remove Duplicates..." from a solution file. */
function readProblemHeader(path) {
  try {
    const m = readFileSync(path, "utf8").match(/Problem:\s*(\d+)\.\s*(.+)/);
    if (m) return { num: Number(m[1]), title: m[2].trim() };
  } catch {
    /* ignore */
  }
  return null;
}

/** Collect problems for a difficulty: [{ num, title, link }]. */
function collect(dir) {
  const problems = [];
  for (const slug of subDirs(dir)) {
    const folder = `${dir}/${slug}`;
    const file = solutionFile(folder);
    if (!file) continue; // skip empty folders
    const link = `${folder}/${file}`;
    const header = readProblemHeader(link);
    const slugNum = Number((slug.match(/^(\d+)/) ?? [])[1]);
    problems.push({
      num: header?.num ?? (Number.isNaN(slugNum) ? 0 : slugNum),
      title: header?.title ?? titleFromSlug(slug),
      link,
    });
  }
  return problems.sort((a, b) => a.num - b.num);
}

/** Replace the text between `<!-- NAME:START -->` and `<!-- NAME:END -->`. */
function replaceBlock(content, name, inner) {
  const re = new RegExp(`(<!-- ${name}:START -->)([\\s\\S]*?)(<!-- ${name}:END -->)`);
  if (!re.test(content)) {
    throw new Error(`Markers for "${name}" not found in ${README}.`);
  }
  return content.replace(re, `$1\n${inner}\n$3`);
}

const byDifficulty = DIFFICULTIES.map((d) => ({ ...d, problems: collect(d.dir) }));
const total = byDifficulty.reduce((sum, d) => sum + d.problems.length, 0);

// --- Stats table ---
const statsRows = byDifficulty
  .map((d) => `| ${d.emoji} **${d.label}** | ${d.problems.length} |`)
  .join("\n");
const stats = [
  "| Difficulty | Solved |",
  "| :--- | :--- |",
  statsRows,
  `| **Total** | **${total}** |`,
].join("\n");

// --- Solutions index ---
const sections = byDifficulty
  .filter((d) => d.problems.length > 0)
  .map((d) => {
    const rows = d.problems
      .map(
        (p) =>
          `| ${String(p.num).padStart(4, "0")} | ${p.title} | [Solution](${p.link}) |`,
      )
      .join("\n");
    return [
      `### ${d.emoji} ${d.label}`,
      "",
      "| # | Problem | Solution |",
      "| :--- | :--- | :--- |",
      rows,
    ].join("\n");
  });
const solutions = sections.length ? sections.join("\n\n") : "_No solutions yet._";

let content = readFileSync(README, "utf8");
content = replaceBlock(content, "STATS", stats);
content = replaceBlock(content, "SOLUTIONS", solutions);
writeFileSync(README, content);

console.log(
  `Updated ${README}: ` +
    byDifficulty.map((d) => `${d.label} ${d.problems.length}`).join(" | ") +
    ` | Total ${total}`,
);
