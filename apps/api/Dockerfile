FROM node:20-slim AS base
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /app

# Instalar dependências
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/
COPY packages/database/package.json packages/database/
RUN pnpm install --frozen-lockfile --prod=false

# Gerar Prisma Client
FROM deps AS generate
COPY packages/database/ packages/database/
RUN pnpm --filter @medivisitas/database generate

# Build da API
FROM generate AS build
COPY apps/api/ apps/api/
RUN pnpm --filter @medivisitas/api build

# Produção
FROM base AS production
ENV NODE_ENV=production
COPY --from=generate /app/node_modules/.pnpm/@prisma+client*/node_modules/@prisma/client /app/node_modules/@prisma/client
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/apps/api/node_modules /app/apps/api/node_modules
COPY --from=build /app/apps/api/dist /app/apps/api/dist
COPY packages/database/prisma/schema.prisma /app/packages/database/prisma/

WORKDIR /app/apps/api
EXPOSE 3002
CMD ["node", "dist/server.js"]
