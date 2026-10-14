# syntax=docker/dockerfile:1
ARG NODE_VERSION=24.15.0
FROM node:${NODE_VERSION}-bookworm-slim AS base
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates ffmpeg fontconfig fonts-noto-core fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/* \
    && npm install --global pnpm@12.11.2 \
    && npm cache clean --force

FROM base AS build
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN pnpm install --frozen-lockfile
COPY apps ./apps
COPY packages ./packages
RUN pnpm typecheck && pnpm build

FROM base AS api
ENV NODE_ENV=production \
    AI_PROVIDER=openai \
    API_HOST=0.0.0.0 \
    API_PORT=3187 \
    DATABASE_PATH=/data/oye.sqlite \
    MEDIA_PATH=/data/media \
    VIDEO_FONT_FAMILY="Noto Sans"
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/apps/api ./apps/api
COPY --from=build --chown=node:node /app/packages ./packages
COPY --from=build --chown=node:node /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/tsconfig.base.json ./
RUN mkdir -p /data && chown node:node /data
USER node
EXPOSE 3187
CMD ["node", "apps/api/dist/index.js"]

FROM nginx:1.28.0-alpine AS web
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 8080
