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

- **GitHub Pages** — `public/CNAME` already contains
  `kinglet.rushlightlab.com`. Point a DNS `CNAME` record at
  `rushlightlab.github.io`, then enable Pages for this repository and serve the
  built `dist/` output (or publish it with an Actions workflow).
- **Cloudflare Pages / Vercel / Netlify** — point at this repo, build command
  `pnpm build`, output directory `dist/`.
- **Docker** — `docker build -t kinglet-site .` (nginx serves the static
  output behind your TLS proxy).

All GitHub and GHCR links already point at
[`rushlightlab`](https://github.com/rushlightlab).
