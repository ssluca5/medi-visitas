import { PrismaClient, Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

function createPrismaClient() {
  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === "production"
        ? [
            { level: "warn", emit: "stdout" },
            { level: "error", emit: "stdout" },
          ]
        : [
            { level: "query", emit: "event" },
            { level: "warn", emit: "stdout" },
          ],
  });

  // Log de queries lentas em desenvolvimento
  if (process.env.NODE_ENV !== "production") {
    client.$on("query" as never, (e: { duration: number; query: string }) => {
      if (e.duration > 100) {
        console.warn(`[Slow Query] ${e.duration}ms: ${e.query.slice(0, 100)}`);
      }
    });
  }

  return client.$extends({
    model: {
      $allModels: {
        async softDelete<T>(this: T, where: Record<string, unknown>) {
          const context = Prisma.getExtensionContext(this);
          return (context as any).update({
            where,
            data: { deletedAt: new Date() },
          });
        },
        async softDeleteMany<T>(this: T, where: Record<string, unknown>) {
          const context = Prisma.getExtensionContext(this);
          return (context as any).updateMany({
            where,
            data: { deletedAt: new Date() },
          });
        },
      },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
