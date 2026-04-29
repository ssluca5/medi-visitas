import { PrismaClient, Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

function createPrismaClient() {
  return new PrismaClient().$extends({
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
