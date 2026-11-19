# syntax=docker/dockerfile:1

# ---- build: render the static site ----
FROM node:26-bookworm-slim AS build
WORKDIR /site
RUN npm install -g pnpm@12.21.0
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# ---- runtime: any static file server; nginx is a tiny default ----
FROM nginx:alpine
COPY --from=build /site/dist /usr/share/nginx/html
