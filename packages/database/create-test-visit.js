const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Find an existing professional
  const prof = await prisma.profissional.findFirst({
    where: { deletedAt: null },
    select: { id: true, nome: true },
  });

  if (!prof) {
    console.log("Nenhum profissional encontrado. Execute o seed primeiro.");
    process.exit(1);
  }

  console.log("Profissional:", prof.nome, `(${prof.id})`);

  // Create a test visit for tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const visita = await prisma.visita.create({
    data: {
      profissionalId: prof.id,
      userId: "user_test",
      dataVisita: tomorrow.toISOString(),
      duracaoMinutos: 30,
      status: "AGENDADA",
    },
    select: { id: true, status: true, dataVisita: true },
  });

  console.log("Visita criada:", visita.id, visita.status, visita.dataVisita);
}

main()
  .catch((e) => {
    console.error("Erro:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
