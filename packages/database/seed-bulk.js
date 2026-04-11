import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Buscando usuário e especialidades...");

  // Buscar o primeiro usuário para atrelar itens
  const user = await prisma.user.findFirst();
  if (!user) {
    throw new Error(
      "Nenhum usuário encontrado. Logue na aplicação antes para criar a conta.",
    );
  }
  const userId = user.clerkId;
  console.log(`👤 Usuário encontrado: ${user.name || user.email} (${userId})`);

  // Pegar especialidades
  const especialidades = await prisma.especialidade.findMany();
  if (especialidades.length === 0) {
    throw new Error("Nenhuma especialidade encontrada no banco.");
  }

  const nomes = [
    "João",
    "Maria",
    "Pedro",
    "Ana",
    "Carlos",
    "Beatriz",
    "Lucas",
    "Juliana",
    "Fernando",
    "Carla",
    "Roberto",
    "Patrícia",
    "Ricardo",
    "Mariana",
    "André",
    "Camila",
    "Rodrigo",
    "Aline",
    "Marcelo",
    "Fernanda",
    "Felipe",
    "Paula",
    "Diego",
    "Letícia",
    "Bruno",
    "Amanda",
    "Gustavo",
    "Jessica",
    "Renato",
    "Vanessa",
  ];
  const sobrenomes = [
    "Silva",
    "Santos",
    "Oliveira",
    "Souza",
    "Rodrigues",
    "Ferreira",
    "Alves",
    "Pereira",
    "Lima",
    "Gomes",
    "Costa",
    "Ribeiro",
    "Martins",
    "Carvalho",
    "Almeida",
    "Lopes",
    "Soares",
    "Fernandes",
    "Vieira",
    "Barbosa",
  ];

  const numProfissionais = 50;
  console.log(`\n👨‍⚕️ Inserindo ${numProfissionais} profissionais...`);

  const profissionaisCriados = [];

  for (let i = 0; i < numProfissionais; i++) {
    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
    const especialidade =
      especialidades[Math.floor(Math.random() * especialidades.length)];
    const tratamentos = ["DR", "DRA", "PROF", "PROFA"];
    const potenciais = ["BAIXO", "MEDIO", "ALTO", "ESTRATEGICO"];

    // Criando Profissional
    const prof = await prisma.profissional.create({
      data: {
        nome: `${nome} ${sobrenome}`,
        crm: `${Math.floor(10000 + Math.random() * 90000)}-SP`,
        email: `${nome.toLowerCase()}.${sobrenome.toLowerCase()}${i}@exemplo.com`,
        telefone: `119${Math.floor(10000000 + Math.random() * 90000000)}`,
        potencial: potenciais[Math.floor(Math.random() * potenciais.length)],
        estagioPipeline: "PROSPECTADO",
        especialidadeId: especialidade.id,
        tratamento: tratamentos[Math.floor(Math.random() * tratamentos.length)],
        sexo: nome.endsWith("a") ? "FEMININO" : "MASCULINO",
        observacoes: `Médico ${nome} adicionado gerado por script de carga.`,
        contatos: {
          create: [
            {
              tipo: "TELEFONE",
              valor: `115${Math.floor(1000000 + Math.random() * 9000000)}`,
            },
            {
              tipo: "EMAIL",
              valor: `contato_${nome.toLowerCase()}@clinica.com`,
            },
          ],
        },
      },
    });
    profissionaisCriados.push(prof);

    if ((i + 1) % 10 === 0)
      console.log(`  ✓ ${i + 1} profissionais inseridos.`);
  }

  const numVisitas = 200;
  console.log(`\n📅 Inserindo ${numVisitas} visitas no passado e futuro...`);

  const prioridades = ["BAIXA", "MEDIA", "ALTA", "URGENTE"];
  const statusPossiveis = [
    "AGENDADA",
    "REALIZADA",
    "CANCELADA",
    "NAO_REALIZADA",
  ];

  let countPassado = 0;
  let countFuturo = 0;

  for (let i = 0; i < numVisitas; i++) {
    const prof =
      profissionaisCriados[
        Math.floor(Math.random() * profissionaisCriados.length)
      ];

    // Distribuir as visitas entre -30 dias e +30 dias usando a hora atual como âncora
    const hoje = new Date();
    // Hora cheia entre 8 e 17
    const hora = 8 + Math.floor(Math.random() * 10);
    const minuto = Math.random() > 0.5 ? 0 : 30; // Minutos 00 ou 30

    const diasAdd = Math.floor(Math.random() * 61) - 30; // -30 a +30
    const dDate = new Date(hoje);
    dDate.setDate(dDate.getDate() + diasAdd);
    dDate.setHours(hora, minuto, 0, 0);

    const isPast = dDate < hoje;

    // Status e duração
    let status;
    if (isPast) {
      countPassado++;
      status = Math.random() > 0.8 ? "CANCELADA" : "REALIZADA";
      if (Math.random() > 0.95) status = "NAO_REALIZADA";
    } else {
      countFuturo++;
      status = Math.random() > 0.1 ? "AGENDADA" : "CANCELADA";
      // Permite alguns testarem status finalizado
      if (Math.random() > 0.9) status = "REALIZADA";
    }

    const duracao = [15, 30, 45, 60, 90][Math.floor(Math.random() * 5)];
    const endTime = new Date(dDate);
    endTime.setMinutes(endTime.getMinutes() + duracao);

    const visita = await prisma.visita.create({
      data: {
        profissionalId: prof.id,
        userId: userId,
        dataVisita: dDate.toISOString(),
        duracaoMinutos: duracao,
        status: status,
        objetivoVisita: `Objetivo da visita gerada. Falar sobre o produto principal.`,
        resumo:
          status !== "AGENDADA"
            ? `O médico foi muito receptivo. Entreguei os materiais.`
            : null,
        proximaAcao: status !== "AGENDADA" ? `Voltar em 30 dias` : null,
        agendaItems: {
          create: [
            {
              userId: userId,
              profissionalId: prof.id,
              dataHoraInicio: dDate.toISOString(),
              dataHoraFim: endTime.toISOString(),
              status: isPast
                ? status === "REALIZADA"
                  ? "REALIZADO"
                  : "CANCELADO"
                : status === "AGENDADA"
                  ? "PLANEJADO"
                  : "CANCELADO",
              prioridade:
                prioridades[Math.floor(Math.random() * prioridades.length)],
            },
          ],
        },
      },
    });

    if ((i + 1) % 50 === 0)
      console.log(`  ✓ ${i + 1} visitas agendadas inseridas.`);
  }

  console.log(`\n🎉 Seed conluído!`);
  console.log(`- ${profissionaisCriados.length} Profissionais criados`);
  console.log(
    `- ${countPassado} Visitas no passado (realizadas/canceladas) e ${countFuturo} no futuro.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
