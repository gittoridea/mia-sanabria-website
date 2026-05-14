# Multi-stage build for static-export Next.js 15 site.
# Stage 1 builds with Bun; Stage 2 serves with Caddy (zero-config TLS termination
# is handled by Traefik on Dokploy — Caddy here serves plain HTTP behind it).

FROM oven/bun:1.3 AS deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile || bun install

FROM oven/bun:1.3 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
# Cycle 33B — Bridge IDX runtime env vars (baked into static bundle at build time).
# Browser-side credentials only. Server token + client secret are NEVER declared
# here. NEXT_PUBLIC_ prefix is the Next.js convention for client-bundle vars.
ARG NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN
ENV NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN=$NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN
ARG NEXT_PUBLIC_BRIDGE_DATASET_ID
ENV NEXT_PUBLIC_BRIDGE_DATASET_ID=$NEXT_PUBLIC_BRIDGE_DATASET_ID
ARG NEXT_PUBLIC_BRIDGE_RESOURCE_PATH
ENV NEXT_PUBLIC_BRIDGE_RESOURCE_PATH=$NEXT_PUBLIC_BRIDGE_RESOURCE_PATH
ARG NEXT_PUBLIC_BRIDGE_DEMO
ENV NEXT_PUBLIC_BRIDGE_DEMO=$NEXT_PUBLIC_BRIDGE_DEMO
ARG NEXT_PUBLIC_BRIDGE_MEDIA_HOSTS
ENV NEXT_PUBLIC_BRIDGE_MEDIA_HOSTS=$NEXT_PUBLIC_BRIDGE_MEDIA_HOSTS
RUN bun run build

FROM caddy:2-alpine AS run
WORKDIR /srv
COPY --from=build /app/out /srv
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
