FROM node:20-slim AS base
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /app

# Instalar dependências
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/
COPY packages/database/package.json packages/database/
RUN pnpm install --frozen-lockfile --prod=false

# Build
FROM deps AS build
COPY packages/database/ packages/database/
COPY apps/web/ apps/web/
ARG PUBLIC_API_URL
ARG PUBLIC_CLERK_PUBLISHABLE_KEY
ARG PUBLIC_SENTRY_DSN
ARG PUBLIC_LANDING_URL
ENV PUBLIC_API_URL=$PUBLIC_API_URL
ENV PUBLIC_CLERK_PUBLISHABLE_KEY=$PUBLIC_CLERK_PUBLISHABLE_KEY
ENV PUBLIC_SENTRY_DSN=$PUBLIC_SENTRY_DSN
ENV PUBLIC_LANDING_URL=$PUBLIC_LANDING_URL
RUN pnpm --filter @medivisitas/web build

# Produção
FROM node:20-slim AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/apps/web/build ./
COPY --from=build /app/apps/web/package.json ./
RUN npm install --omit=dev 2>/dev/null || true

EXPOSE 3000
CMD ["node", "index.js"]
