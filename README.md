# Kinglet site

Docs and landing page for [Kinglet](https://github.com/rushlightlab/kinglet) — the
tiny self-hostable log platform. Built with [Astro](https://astro.build) +
[Starlight](https://starlight.astro.build): static output, no client-side
framework, deployable anywhere.

Production URL: **https://kinglet.rushlightlab.com** (set as the canonical
`site` in `astro.config.mjs`; override with `SITE_URL` for other hosts).

## Develop

```bash
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # static output in dist/
```

## Deploy

Any static host works:

- **Cloudflare Pages** — framework preset **Astro**, build command
  `pnpm build`, output directory `dist`. Leave the **deploy command empty**:
  Pages publishes `dist` itself. A deploy command of `npx wrangler deploy`
  makes Wrangler auto-add the Cloudflare Astro adapter, which is unnecessary
  for this static site and currently breaks on Astro 7's Markdown pipeline.
- **Cloudflare Workers (static assets)** — if you prefer
  `npx wrangler deploy`, the checked-in `wrangler.jsonc` publishes `dist` as
  static assets and disables framework auto-configuration.
- **GitHub Pages** — `public/CNAME` already contains
  `kinglet.rushlightlab.com`. Point a DNS `CNAME` record at
  `rushlightlab.github.io`, then enable Pages for this repository and serve the
  built `dist/` output (or publish it with an Actions workflow).
- **Vercel / Netlify** — point at this repo, build command `pnpm build`,
  output directory `dist/`.
- **Docker** — `docker build -t kinglet-site .` (nginx serves the static
  output behind your TLS proxy).

The build needs Node 24+ (`engines`), which is what Cloudflare's image
provides. All GitHub and GHCR links already point at
[`rushlightlab`](https://github.com/rushlightlab).
