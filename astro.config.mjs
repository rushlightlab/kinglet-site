import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";

// TODO: replace with the real domain before deploying.
const SITE = "https://kinglet.example.com";

/* Code highlighting in the Kinglet palette — same colors the landing's
   code shell uses: faint comments, warm strings, coral keywords, gold keys. */
const kingletCodeTheme = {
  name: "kinglet-dark",
  type: "dark",
  colors: {
    "editor.background": "#0e1013",
    "editor.foreground": "#c9d0cb",
  },
  tokenColors: [
    { scope: "comment", settings: { foreground: "#55625b" } },
    { scope: "string", settings: { foreground: "#f7e6a8" } },
    { scope: "keyword", settings: { foreground: "#ff9d85" } },
    { scope: "storage.type", settings: { foreground: "#ff9d85" } },
    { scope: "entity.name.function", settings: { foreground: "#ffd66b" } },
    { scope: "support.function", settings: { foreground: "#ffd66b" } },
    { scope: "entity.name.tag", settings: { foreground: "#ffd66b" } },
    { scope: "constant.numeric", settings: { foreground: "#e0c58c" } },
    { scope: "variable.parameter", settings: { foreground: "#e0c58c" } },
    { scope: "punctuation.definition.string", settings: { foreground: "#f7e6a8" } },
    { scope: "punctuation", settings: { foreground: "#9aa39b" } },
  ],
};

export default defineConfig({
  site: SITE,
  output: "static",
  integrations: [
    starlight({
      title: "Kinglet",
      description: "Small. Light. King. — the tiny self-hostable log platform.",
      logo: { src: "./src/assets/logo.svg" },
      // TODO: point at the real repository.
      social: [
        {
          label: "GitHub",
          icon: "github",
          href: "https://github.com/your-org/kinglet",
        },
      ],
      customCss: ["./src/styles/custom.css"],
      expressiveCode: { themes: [kingletCodeTheme] },
      sidebar: [
        {
          label: "Start",
          items: [
            { label: "Overview", link: "/overview/" },
            { label: "Quickstart", link: "/quickstart/" },
            { label: "Query language", link: "/query-language/" },
          ],
        },
        {
          label: "Sending logs",
          items: [
            { label: "HTTP ingestion", link: "/ingestion/" },
            { label: "Node SDK", link: "/node-sdk/" },
            { label: "API reference", link: "/api/" },
          ],
        },
        {
          label: "Operating",
          items: [
            { label: "Authentication & projects", link: "/authentication/" },
            { label: "Storage backends", link: "/storage/" },
            { label: "Self-hosting", link: "/self-hosting/" },
          ],
        },
      ],
    }),
    sitemap(),
  ],
});
