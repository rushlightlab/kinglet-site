# 👑 kinglet-site

Docs and landing page for [Kinglet](../kinglet) — the tiny self-hostable log
platform. Built with [Astro](https://astro.build) +
[Starlight](https://starlight.astro.build): static output, zero client-side
JavaScript, deployable anywhere.

## Develop

```bash
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # static output in dist/
```

## Deploy

Any static host works:

- **Cloudflare Pages / Vercel / Netlify** — point at the repo, build command
  `pnpm build`, output directory `dist/`
- **Docker** — `docker build -t kinglet-site .` (nginx serves the static
  output)

## Before going live

- [ ] Set the real domain in `astro.config.mjs` (`site:`)
- [ ] Point `social.github` at the real repository
- [ ] Update the GitHub links in `storage.mdx` and `index.mdx`

## License

MIT — see [LICENSE](./LICENSE).
