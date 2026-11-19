# syntax=docker/dockerfile:1

# ---- build: render the static site ----
FROM node:26.13.1-bookworm-slim AS build
WORKDIR /site
RUN npm install -g pnpm@12.21.0
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=kinglet-site-pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# ---- runtime: unprivileged nginx serving the static output ----
FROM nginxinc/nginx-unprivileged:1.31.7-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx --from=build /site/dist /usr/share/nginx/html
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
