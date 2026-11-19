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

Production is a **Cloudflare Worker with static assets** at
[kinglet.rushlightlab.com](https://kinglet.rushlightlab.com), deployed from
this repo by Workers Builds:

- Build command: `pnpm build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`
- `wrangler.jsonc` publishes `dist` as static assets and prevents Wrangler
  from adding the Cloudflare Astro adapter (unnecessary for a fully static
  site, and currently incompatible with Astro 7's Markdown pipeline).

An actual Cloudflare **Pages** project also works: framework preset Astro,
build `pnpm build`, output directory `dist`, and an empty deploy command.

Other static hosts work too:

- **Vercel / Netlify** — point at this repo, build command `pnpm build`,
  output directory `dist/`.
- **Docker** — `docker build -t kinglet-site .` (nginx serves the static
  output behind your TLS proxy).

The build needs Node 24+ (`engines`), which is what Cloudflare's image
provides. All GitHub and GHCR links already point at
[`rushlightlab`](https://github.com/rushlightlab).
