import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";

// TODO: replace with the real domain before deploying.
const SITE = "https://kinglet.example.com";

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
            { label: "Storage backends", link: "/storage/" },
            { label: "Self-hosting", link: "/self-hosting/" },
          ],
        },
      ],
    }),
    sitemap(),
  ],
});
