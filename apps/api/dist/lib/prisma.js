import { PrismaClient, Prisma } from "@prisma/client";
const globalForPrisma = globalThis;
function createPrismaClient() {
  return new PrismaClient().$extends({
    model: {
      $allModels: {
        async softDelete(where) {
          const context = Prisma.getExtensionContext(this);
          return context.update({
            where,
            data: { deletedAt: new Date() },
          });
        },
        async softDeleteMany(where) {
          const context = Prisma.getExtensionContext(this);
          return context.updateMany({
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
