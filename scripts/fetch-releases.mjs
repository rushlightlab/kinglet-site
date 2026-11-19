import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Build-time release sync.
 *
 * GitHub Releases are the source of truth. This script runs before `astro build`,
 * fetches the public releases, and regenerates:
 *   - src/data/releases.json      (latest version for the landing badge)
 *   - src/content/docs/changelog.md (static changelog page)
 *
 * If GitHub is unreachable or rate-limits the build, the committed snapshot is
 * left in place so the site still builds.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const dataPath = path.join(root, "src/data/releases.json");
const pagePath = path.join(root, "src/content/docs/changelog.md");
const repo = "rushlightlab/kinglet";
const api = `https://api.github.com/repos/${repo}/releases?per_page=30`;

let previous = { latest: null, releases: [] };
try {
  previous = JSON.parse(await readFile(dataPath, "utf8"));
} catch {
  // first run or missing snapshot
}

function demoteHeadings(markdown) {
  let fence = null;
  return markdown
    .split(/\r?\n/)
    .map((line) => {
      const fenceMatch = line.match(/^(```+|~~~+)/);
      if (fenceMatch) {
        if (!fence) fence = fenceMatch[1][0];
        else if (fenceMatch[1][0] === fence) fence = null;
        return line;
      }
      if (!fence && /^#{1,5}\s/.test(line)) return `#${line}`;
      return line;
    })
    .join("\n");
}

function dateOnly(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

async function refresh() {
  const headers = {
    accept: "application/vnd.github+json",
    "user-agent": "kinglet-site-build",
    "x-github-api-version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetch(api, { headers, signal: AbortSignal.timeout(12_000) });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const json = await res.json();
  if (!Array.isArray(json)) throw new Error("unexpected GitHub response");

  const releases = json
    .filter((r) => !r.draft && r.tag_name)
    .map((r) => ({
      tag: r.tag_name,
      version: String(r.tag_name).replace(/^v/i, ""),
      name: r.name || r.tag_name,
      body: r.body || "",
      url: r.html_url,
      publishedAt: dateOnly(r.published_at || r.created_at),
      prerelease: Boolean(r.prerelease),
    }))
    .toSorted((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));

  if (releases.length === 0) throw new Error("no published releases");
  return { latest: releases[0], releases };
}

function renderPage(data) {
  const sections = data.releases
    .map((release, index) => {
      const body = demoteHeadings(String(release.body || "").trim()) || "_No release notes yet._";
      const meta = [
        release.publishedAt ? `**${release.publishedAt}**` : "",
        `[GitHub release](${release.url})`,
        index === 0 ? "latest" : "",
        release.prerelease ? "pre-release" : "",
      ]
        .filter(Boolean)
        .join(" · ");
      return `## ${release.name}\n\n${meta}\n\n${body}\n`;
    })
    .join("\n---\n\n");

  return `---
title: Changelog
description: Kinglet release notes, generated from GitHub Releases.
---

Every release is published on [GitHub Releases](https://github.com/${repo}/releases).
This page is regenerated from those releases during the site build.

${sections}`;
}

const data = await refresh().catch((err) => {
  console.warn(
    `[changelog] could not refresh from GitHub (${err.message}); using committed snapshot.`,
  );
  return previous.latest && previous.releases.length > 0 ? previous : null;
});

if (!data) {
  console.warn("[changelog] no release snapshot available; leaving committed changelog untouched.");
} else {
  await mkdir(path.dirname(dataPath), { recursive: true });
  await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await writeFile(pagePath, renderPage(data), "utf8");
  console.log(`[changelog] synced ${data.releases.length} release(s); latest ${data.latest.tag}`);
}
