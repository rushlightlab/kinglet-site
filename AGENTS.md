# AGENTS.md

Instructions for AI coding agents working in the Kinglet docs/landing site
repository. Read this file and [`README.md`](./README.md) before changing
content or configuration. If an instruction here conflicts with an explicit
request from the user, ask first.

## TL;DR

- Node **26+**, pnpm **12.21.0** (see `package.json`; Node is pinned in
  `.nvmrc`).
- Never push, merge, deploy, change Cloudflare/Wrangler settings, or rotate
  secrets without explicit user approval.
- Never invent product behavior. Verify claims against the `rushlightlab/kinglet`
  code or ask.
- Run `pnpm lint`, `pnpm format:check`, and `pnpm build` before declaring work
  complete.
- Do not hand-edit generated changelog or release data.

## What this repository is

The public documentation and landing page for Kinglet, the tiny self-hostable
log platform:

- Production: <https://kinglet.rushlightlab.com>
- Source of the product: <https://github.com/rushlightlab/kinglet>
- Built with Astro 7 and Starlight, fully static.
- Deployed as a Cloudflare Worker with static assets from this repository.
- Docker is a supported fallback (non-root nginx on port 8080).
- `SITE_URL` overrides the canonical origin from `astro.config.mjs` for
  previews and alternate hosts.

This repo is separate from the Kinglet application. Content changes often need to
be coordinated with application changes, especially API, configuration, and
security documentation.

## Repository map

| Path                            | Purpose                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------ |
| `src/pages/index.astro`         | Marketing landing page, including small inline vanilla JS for copy/tabs/scroll |
| `src/content/docs/*.mdx`        | Starlight documentation pages; one file per route                              |
| `src/content/docs/changelog.md` | Generated from GitHub Releases; do not edit                                    |
| `src/data/releases.json`        | Generated latest-release badge data; do not edit                               |
| `src/content.config.ts`         | Starlight content collection                                                   |
| `astro.config.mjs`              | Site URL, Starlight config, sidebar, code theme, sitemap                       |
| `src/styles/`                   | Global and landing-page CSS                                                    |
| `src/assets/`                   | Logo and other imported assets                                                 |
| `public/`                       | Static files copied as-is (`_headers`, favicon)                                |
| `scripts/fetch-releases.mjs`    | Prebuild release sync                                                          |
| `nginx.conf`                    | Runtime config for the Docker image                                            |
| `wrangler.jsonc`                | Cloudflare static-assets Worker config                                         |
| `.github/workflows/ci.yml`      | Format check, lint, and build on PRs/main                                      |

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # static output in dist/
pnpm preview
pnpm lint         # oxlint --deny-warnings
pnpm format       # oxfmt (writes files)
pnpm format:check
```

`pnpm build` runs `scripts/fetch-releases.mjs` before Astro. It fetches
`rushlightlab/kinglet` GitHub Releases and regenerates the changelog and release
badge. If GitHub is unavailable or rate-limited, the committed snapshot is used.
Set `GITHUB_TOKEN` in the build environment for a higher rate limit; never commit
it.

There is no typecheck or test script. Do not claim that tests passed. The build
is the content validation gate; use `pnpm dev` for visual/interaction checks.

### Formatting note

Oxfmt formats Astro files through `@astrojs/compiler-rs`. On Windows, the
repository intentionally uses `--threads=1` in `format`/`format:check` because
the Astro native compiler has crashed with multiple threads. Do not remove that
workaround without verifying formatting repeatedly on the target platform.

## Content rules

- Docs live at `src/content/docs/<slug>.mdx` and become `/<slug>/` routes.
- Every docs page needs frontmatter:

  ```mdx
  ---
  title: Page title
  description: One-sentence description used by search and social metadata.
  ---
  ```

- Add new pages to the Starlight `sidebar` in `astro.config.mjs`; otherwise they
  are reachable but undiscoverable.
- Use Starlight components intentionally (`<Aside type="note|tip|caution|danger">`,
  etc.) and keep code fences copy-pasteable.
- Internal links start with `/` and should include the trailing slash style used
  by Starlight (`/security/`). Verify links when moving pages.
- Keep the landing page marketing copy concise; keep docs operational and
  precise.
- Do not include secrets, private hostnames, internal IP addresses, tokens, or
  personal data. Use placeholders such as `<your-domain>`, `<digest>`, and `kl_...`.
- Do not invent configuration variables, endpoints, limits, or security behavior.
  Check the Kinglet source, README, and `.env.example` first.
- Security guidance is a public contract. If application behavior changes,
  update `src/content/docs/security.mdx`, `self-hosting.mdx`, `authentication.mdx`,
  or `api.mdx` in the same effort.

## Common tasks

### Add a documentation page

1. Create `src/content/docs/<slug>.mdx` with `title` and `description`
   frontmatter.
2. Add it to the Starlight sidebar in `astro.config.mjs`.
3. Link it from the most relevant existing page.
4. Run `pnpm build` and verify the route and links.

### Change configuration or security guidance

1. Verify the variable, default, limit, and behavior against the Kinglet source,
   `README.md`, and `.env.example`. Do not infer from the docs alone.
2. Update the affected docs page(s), keeping examples copy-pasteable and using
   placeholders for secrets and hosts.
3. If the change alters the public security posture, update `security.mdx` and
   call it out for the matching Kinglet release.

### Update release notes or the changelog

1. Do not edit `src/content/docs/changelog.md` or `src/data/releases.json`.
2. Publish a clear GitHub Release in `rushlightlab/kinglet`; its body is the
   changelog source.
3. If a Cloudflare deploy hook is configured, the Kinglet `docs-release` workflow
   can refresh the site immediately.

### Change the landing page

1. Edit `src/pages/index.astro` and, if needed, `src/styles/landing.css`.
2. The inline JavaScript is intentionally small and framework-free; test copy,
   tabs, anchor navigation, and responsive behavior.
3. Run `pnpm build` and check the page in `pnpm dev`; do not add a client
   framework just for a small interaction.

### Change the Docker image

1. Edit `Dockerfile`/`nginx.conf` only for Docker-related work.
2. Build and run on port 8080; check `/`, `/_astro/...`, `/healthz`, a missing
   path, security headers, gzip, and the non-root user.
3. Keep `public/_headers` (Cloudflare) and `nginx.conf` (Docker) aligned.

## Generated files

Do not edit by hand:

- `src/content/docs/changelog.md`
- `src/data/releases.json`
- `dist/`, `.astro/`, `.wrangler/`, `node_modules/`

The changelog is generated from GitHub Releases. The release body in
`rushlightlab/kinglet` is therefore the source of truth for release notes.
Publishing a release refreshes both generated files on the next site build. The
Kinglet repo's `docs-release` workflow can trigger a Cloudflare deploy hook when
`CLOUDFLARE_DOCS_DEPLOY_HOOK` is configured.

## Branches and deployment

- `main` - production. Cloudflare Workers Builds deploys from this branch.
- `docs/pre-release` - the working branch for the next Kinglet release. Land
  docs changes here first; promote to `main` when the matching Kinglet release is
  ready.
- Feature/docs branches - short-lived branches that PR into `docs/pre-release`.

Cloudflare Workers Builds configuration:

- Build command: `pnpm build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`
- `wrangler.jsonc` serves `dist` as static assets and handles 404s with
  `404-page`. Do not add the Cloudflare Astro adapter; this site is fully static
  and the adapter is currently incompatible with Astro 7's Markdown pipeline.

Do not change the deploy target, Wrangler config, DNS, or Cloudflare settings
without explicit approval. Do not deploy from a feature branch.

## Docker

The Docker path is a static, non-root nginx image:

```bash
docker build -t kinglet-site:local .
docker run --rm -p 8080:8080 kinglet-site:local
```

- Runtime: `nginxinc/nginx-unprivileged` on port **8080**.
- The build stage uses Node 26.13.1, matching `.nvmrc` and the Kinglet API
  toolchain. Cloudflare Workers Builds needs the version file to override its
  current default.
- `nginx.conf` provides gzip, immutable `/_astro/` caching, security headers,
  `/healthz`, and the Starlight 404 page.
- `public/_headers` is the Cloudflare equivalent; keep the security headers and
  any caching policy aligned when changing one.
- Test Docker changes by building, running on 8080, and checking `/`,
  `/_astro/...`, `/healthz`, and a missing path.
- Do not change the exposed port or run as root without updating this file and
  the README.

## CI

`.github/workflows/ci.yml` runs on `main` pushes and pull requests:

1. `pnpm install --frozen-lockfile`
2. `pnpm run format:check`
3. `pnpm run lint`
4. `pnpm run build`

Do not weaken or skip these checks. If build needs a new environment variable,
document it and configure it without committing secrets.

## Working rules for agents

- Read the relevant Kinglet source before changing API, configuration, storage,
  auth, or security docs. Cross-repo claims must be verifiable.
- Keep changes scoped. Do not reformat the whole site or rewrite unrelated
  content.
- Use pnpm; do not hand-edit `pnpm-lock.yaml`, add dependencies casually, or
  bypass the Astro/Starlight build.
- Do not disable lint rules, add broad ignores, or silence warnings to make
  checks pass. Fix the content/configuration instead.
- Do not hand-edit generated files or commit `dist`, `.astro`, `.wrangler`, or
  `node_modules`.
- Use `pnpm build` to validate routes, links, frontmatter, MDX, and the release
  sync. For visual or interaction changes, run `pnpm dev` and check the affected
  pages.
- Do not claim tests passed; there is no test suite. State what you actually ran.
- If a change affects the product's behavior, API, configuration, security
  guidance, or release notes, coordinate the matching Kinglet change and update
  this repo before release.
- If a requirement is ambiguous, especially around deployment, security claims,
  or release timing, stop and ask.
- Update this file when the content, release, or deployment workflow changes.

## Where to look

- Product README and configuration: `rushlightlab/kinglet` `README.md` and
  `.env.example`.
- Public security guidance: `src/content/docs/security.mdx`.
- Self-hosting and proxy/TLS guidance: `src/content/docs/self-hosting.mdx`.
- API and ingest reference: `src/content/docs/api.mdx`,
  `src/content/docs/ingestion.mdx`.
- Landing page behavior: `src/pages/index.astro` and `src/styles/landing.css`.
- Release sync: `scripts/fetch-releases.mjs`.
- Deployment: `wrangler.jsonc`, `Dockerfile`, `nginx.conf`, and the README.
