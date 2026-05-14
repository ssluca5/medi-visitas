const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const { PrismaClient } = require("@prisma/client");

const TARGET_EMAIL = "lukas.silv@gmail.com";

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  const env = fs.readFileSync(envPath, "utf8");
  for (const line of env.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^"|"$/g, "");
  }
}

loadEnv();
const prisma = new PrismaClient();

function addDays(base, days, hour = 9, minute = 0) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function addMinutes(base, minutes) {
  return new Date(base.getTime() + minutes * 60 * 1000);
}

function pick(items, index) {
  return items[index % items.length];
}

function slug(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function ensureRelatorioSalvoTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "RelatorioSalvo" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "organizationId" TEXT NOT NULL,
      "nome" TEXT NOT NULL,
      "tipo" TEXT NOT NULL,
      "config" JSONB NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "RelatorioSalvo_pkey" PRIMARY KEY ("id")
    )
  `);
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "RelatorioSalvo_userId_organizationId_idx"
    ON "RelatorioSalvo"("userId", "organizationId")
  `);
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "RelatorioSalvo_organizationId_idx"
    ON "RelatorioSalvo"("organizationId")
  `);
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'RelatorioSalvo_organizationId_fkey'
      ) THEN
        ALTER TABLE "RelatorioSalvo"
        ADD CONSTRAINT "RelatorioSalvo_organizationId_fkey"
        FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
      END IF;
    END $$;
  `);
}

async function cleanup(targetEmail) {
  const now = new Date();

  await ensureRelatorioSalvoTable();
  await prisma.$executeRawUnsafe('DELETE FROM "RelatorioSalvo"');

  await prisma.$transaction(async (tx) => {
    await tx.organizationMembro.updateMany({
      where: { deletedAt: null },
      data: { deletedAt: now },
    });
    await tx.organizationConvite.updateMany({
      where: { deletedAt: null },
      data: { deletedAt: now },
    });
    await tx.contatoProfissional.updateMany({
      where: { deletedAt: null },
      data: { deletedAt: now },
    });
    await tx.agendaItem.updateMany({
      where: { deletedAt: null },
      data: { deletedAt: now },
    });
    await tx.notificacao.updateMany({
      where: { deletedAt: null },
      data: { deletedAt: now },
    });
    await tx.meta.updateMany({
      where: { deletedAt: null },
      data: { deletedAt: now },
    });
    await tx.profissional.updateMany({
      where: { deletedAt: null },
      data: { deletedAt: now },
    });
    await tx.subEspecialidade.updateMany({
      where: { deletedAt: null },
      data: { deletedAt: now },
    });
    await tx.especialidade.updateMany({
      where: { deletedAt: null },
      data: { deletedAt: now },
    });
    await tx.materialTecnico.updateMany({
      where: { deletedAt: null },
      data: { deletedAt: now },
    });
    await tx.endereco.updateMany({
      where: { deletedAt: null },
      data: { deletedAt: now },
    });
    await tx.visita.updateMany({
      where: { status: { not: "CANCELADA" } },
      data: {
        status: "CANCELADA",
        motivoCancelamento: "Substituida por massa demo de teste.",
      },
    });
    await tx.organization.updateMany({
      where: { deletedAt: null },
      data: { deletedAt: now, status: "CANCELADO" },
    });
    await tx.user.updateMany({
      where: { email: { not: targetEmail }, deletedAt: null },
      data: { deletedAt: now },
    });
    await tx.user.update({
      where: { email: targetEmail },
      data: { deletedAt: null, tourConcluidoEm: now },
    });
  });
}

async function main() {
  const runId = Date.now().toString(36);
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);

  const targetUser = await prisma.user.findUnique({
    where: { email: TARGET_EMAIL },
  });
  if (!targetUser) {
    throw new Error(`Usuario ${TARGET_EMAIL} nao encontrado no banco.`);
  }

  console.log(`Preservando ${TARGET_EMAIL} (${targetUser.clerkId})`);
  await cleanup(TARGET_EMAIL);

  const org = await prisma.organization.create({
    data: {
      clerkOrgId: `org_demo_lukas_${runId}`,
      nome: "MediVisitas Demo Lucas",
      slug: `medivisitas-demo-lukas-${runId}`,
      plano: "EMPRESARIAL",
      status: "ATIVO",
      trialExpiraEm: addDays(now, 365),
      planoAtivoEm: now,
      limiteUsuarios: 999999,
      limiteProfissionais: 999999,
      transcricoesLimite: 500,
      transcricoesUsadas: 37,
      transcricoesMes: currentMonth,
      transcricoesExtras: 75,
    },
  });

  await prisma.organizationMembro.create({
    data: {
      organizationId: org.id,
      userId: targetUser.clerkId,
      role: "OWNER",
    },
  });

  const equipeSeed = [
    ["user_demo_ana", "Ana Ribeiro", "ana.ribeiro.demo@medivisitas.local"],
    [
      "user_demo_bruno",
      "Bruno Martins",
      "bruno.martins.demo@medivisitas.local",
    ],
    [
      "user_demo_clara",
      "Clara Almeida",
      "clara.almeida.demo@medivisitas.local",
    ],
    ["user_demo_diego", "Diego Costa", "diego.costa.demo@medivisitas.local"],
  ];

  const membros = [targetUser.clerkId];
  for (const [clerkId, name, email] of equipeSeed) {
    await prisma.user.upsert({
      where: { email },
      update: { clerkId, name, deletedAt: null },
      create: { clerkId, name, email },
    });
    await prisma.organizationMembro.create({
      data: { organizationId: org.id, userId: clerkId, role: "MEMBER" },
    });
    membros.push(clerkId);
  }

  const especialidadesSeed = [
    [
      "Cardiologia",
      "Medicos",
      ["Intervencionista", "Eletrofisiologia", "Insuficiencia cardiaca"],
    ],
    ["Endocrinologia", "Medicos", ["Diabetes", "Obesidade", "Tireoide"]],
    [
      "Gastroenterologia",
      "Medicos",
      ["Hepatologia", "Doenca inflamatoria intestinal"],
    ],
    ["Neurologia", "Medicos", ["Cefaleia", "Epilepsia", "Neurovascular"]],
    ["Ortopedia", "Medicos", ["Joelho", "Coluna", "Ombro"]],
    ["Pediatria", "Medicos", ["Neonatologia", "Adolescente"]],
    ["Dermatologia", "Medicos", ["Cosmiatria", "Oncodermatologia"]],
    ["Ginecologia", "Medicos", ["Climaterio", "Reproducao humana"]],
    ["Psiquiatria", "Medicos", ["Ansiedade", "Dependencia quimica"]],
    ["Nutricionista", "Saude", ["Esportiva", "Funcional", "Materno infantil"]],
    ["Farmaceutico", "Farmacia", ["Clinica", "Hospitalar", "Manipulacao"]],
    ["Dentista", "Odontologia", ["Ortodontia", "Implantodontia", "Endodontia"]],
  ];

  const especialidades = [];
  const subEspecialidades = [];
  for (const [nome, categoria, subs] of especialidadesSeed) {
    const esp = await prisma.especialidade.create({
      data: { nome, categoria, organizationId: org.id },
    });
    especialidades.push(esp);
    for (const subNome of subs) {
      subEspecialidades.push(
        await prisma.subEspecialidade.create({
          data: { nome: subNome, especialidadeId: esp.id },
        }),
      );
    }
  }

  const materiaisSeed = [
    ["Guia Cardio Metabolico 2026", "APRESENTACAO"],
    ["Folder Linha Cardiologia", "FOLDER"],
    ["Bula Produto MV-10", "BULA"],
    ["Bula Produto MV-20", "BULA"],
    ["Amostra MV-10 30 capsulas", "AMOSTRA"],
    ["Amostra MV-20 14 comprimidos", "AMOSTRA"],
    ["Protocolo Diabetes Tipo 2", "APRESENTACAO"],
    ["Resumo Estudos Clinicos", "FOLDER"],
    ["Checklist Visita Consultorio", "OUTRO"],
    ["Material Nutri Metabolica", "FOLDER"],
    ["Guia de Obesidade", "APRESENTACAO"],
    ["Amostra Kit Inicial", "AMOSTRA"],
  ];
  const materiais = [];
  for (const [nome, tipo] of materiaisSeed) {
    materiais.push(
      await prisma.materialTecnico.create({
        data: {
          nome,
          tipo,
          descricao: `Material demo para testar fluxo de ${tipo.toLowerCase()}.`,
          arquivoUrl: `https://medivisitas.local/materiais/${slug(nome)}.pdf`,
          organizationId: org.id,
        },
      }),
    );
  }

  const firstNames = [
    "Joao",
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
    "Patricia",
    "Ricardo",
    "Mariana",
    "Andre",
    "Camila",
    "Rodrigo",
    "Aline",
    "Marcelo",
    "Fernanda",
    "Felipe",
    "Paula",
    "Diego",
    "Leticia",
    "Bruno",
    "Amanda",
    "Gustavo",
    "Jessica",
    "Renato",
    "Vanessa",
  ];
  const lastNames = [
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
  const bairros = [
    "Centro",
    "Jardins",
    "Moema",
    "Vila Mariana",
    "Pinheiros",
    "Tatuape",
    "Savassi",
    "Funcionarios",
    "Boa Viagem",
    "Batel",
    "Moinhos de Vento",
  ];
  const cidades = [
    ["Sao Paulo", "SP"],
    ["Campinas", "SP"],
    ["Santos", "SP"],
    ["Rio de Janeiro", "RJ"],
    ["Belo Horizonte", "MG"],
    ["Curitiba", "PR"],
    ["Porto Alegre", "RS"],
    ["Recife", "PE"],
    ["Goiania", "GO"],
  ];
  const potenciais = ["BAIXO", "MEDIO", "ALTO", "ESTRATEGICO"];
  const classificacoes = ["FORTE", "INTERMEDIARIO", "FRACO"];
  const tratamentos = ["DR", "DRA", "PROF", "PROFA"];
  const stages = [
    ...Array(18).fill("PROSPECTADO"),
    ...Array(20).fill("VISITADO"),
    ...Array(18).fill("INTERESSADO"),
    ...Array(20).fill("PRESCRITOR"),
    ...Array(14).fill("FIDELIZADO"),
  ];
  const stageOrder = [
    "PROSPECTADO",
    "VISITADO",
    "INTERESSADO",
    "PRESCRITOR",
    "FIDELIZADO",
  ];
  const profissionais = [];

  for (let i = 0; i < stages.length; i++) {
    const nome = `${pick(firstNames, i)} ${pick(lastNames, i * 7)} ${pick(lastNames, i * 11)}`;
    const cidade = pick(cidades, i);
    const esp = pick(especialidades, i * 5);
    const subsDaEsp = subEspecialidades.filter(
      (s) => s.especialidadeId === esp.id,
    );
    const endereco = await prisma.endereco.create({
      data: {
        logradouro: `Rua Demo ${100 + i}`,
        numero: String(50 + i),
        complemento: i % 3 === 0 ? `Sala ${10 + i}` : null,
        bairro: pick(bairros, i),
        cidade: cidade[0],
        estado: cidade[1],
        cep: `${String(10000 + i).padStart(5, "0")}-${String(100 + i).padStart(3, "0")}`,
      },
    });
    const stage = stages[i];
    const prof = await prisma.profissional.create({
      data: {
        nome,
        crm: `${String(10000 + i * 137).slice(0, 5)}-${cidade[1]}`,
        email: `${slug(nome)}@clinica-demo.local`,
        telefone: `11 9${String(80000000 + i * 17321).slice(0, 8)}`,
        potencial: pick(potenciais, i * 3),
        estagioPipeline: stage,
        classificacao: stage === "PROSPECTADO" ? null : pick(classificacoes, i),
        especialidadeId: esp.id,
        subEspecialidadeId: subsDaEsp.length ? pick(subsDaEsp, i).id : null,
        enderecoId: endereco.id,
        cpfCnpj: `${String(10000000000 + i * 7919).slice(0, 11)}`,
        sexo:
          i % 3 === 0
            ? "FEMININO"
            : i % 3 === 1
              ? "MASCULINO"
              : "NAO_INFORMADO",
        dataNascimento: addDays(now, -11000 - i * 80, 12),
        tratamento: pick(tratamentos, i),
        observacoes: `Perfil demo com potencial ${pick(potenciais, i * 3)}. Preferencia por visitas ${i % 2 === 0 ? "pela manha" : "no fim da tarde"}.`,
        nomeConjuge:
          i % 4 === 0
            ? `${pick(firstNames, i + 4)} ${pick(lastNames, i + 2)}`
            : null,
        dataNascConjuge: i % 4 === 0 ? addDays(now, -10500 - i * 31, 12) : null,
        organizationId: org.id,
      },
    });
    profissionais.push(prof);

    await prisma.contatoProfissional.createMany({
      data: [
        {
          profissionalId: prof.id,
          tipo: "WHATSAPP",
          valor: `11 9${String(70000000 + i * 21113).slice(0, 8)}`,
          observacao: "Secretaria responde em horario comercial",
        },
        {
          profissionalId: prof.id,
          tipo: "EMAIL",
          valor: `${slug(nome)}.agenda@clinica-demo.local`,
          observacao: "Agenda e materiais",
        },
        ...(i % 5 === 0
          ? [
              {
                profissionalId: prof.id,
                tipo: "TELEFONE",
                valor: `11 ${String(30000000 + i * 1234).slice(0, 8)}`,
                observacao: "Recepcao",
              },
            ]
          : []),
      ],
    });

    let previous = null;
    const lastStageIndex = stageOrder.indexOf(stage);
    for (let step = 0; step <= lastStageIndex; step++) {
      await prisma.estagioLog.create({
        data: {
          profissionalId: prof.id,
          estagioAnterior: previous,
          estagioNovo: stageOrder[step],
          userId: pick(membros, i + step),
          organizationId: org.id,
          createdAt: addDays(now, -95 + i + step * 12, 10 + (step % 6)),
        },
      });
      previous = stageOrder[step];
    }
  }

  const visitas = [];
  const objetivos = [
    "Apresentar nova linha terapeutica",
    "Reforcar estudos clinicos recentes",
    "Avaliar resposta a materiais entregues",
    "Planejar proxima acao de fidelizacao",
    "Introduzir protocolo de acompanhamento",
  ];
  const resumos = [
    "Profissional receptivo, solicitou dados comparativos e demonstrou interesse.",
    "Visita objetiva, com entrega de material e alinhamento de retorno.",
    "Houve duvidas sobre posologia; material tecnico foi revisado em conjunto.",
    "Secretaria confirmou melhor horario para proximas visitas.",
    "Bom potencial para evoluir no pipeline apos novo contato.",
  ];

  for (let i = 0; i < 220; i++) {
    const prof = pick(profissionais, i * 13);
    const past = i < 150;
    const offset = past ? -80 + (i % 80) : i % 38;
    const dataVisita = addDays(now, offset, 8 + (i % 9), i % 2 === 0 ? 0 : 30);
    const userId = i % 4 === 0 ? pick(membros.slice(1), i) : targetUser.clerkId;
    const status = past
      ? i % 11 === 0
        ? "NAO_REALIZADA"
        : i % 9 === 0
          ? "CANCELADA"
          : "REALIZADA"
      : i % 12 === 0
        ? "CANCELADA"
        : "AGENDADA";
    const visita = await prisma.visita.create({
      data: {
        profissionalId: prof.id,
        userId,
        dataVisita,
        duracaoMinutos: pick([30, 45, 60, 75], i),
        status,
        objetivoVisita: pick(objetivos, i),
        resumo: status === "REALIZADA" ? pick(resumos, i) : null,
        proximaAcao:
          status === "REALIZADA"
            ? "Retornar em 30 dias com dados de adesao."
            : null,
        audioUrl:
          status === "REALIZADA" && i % 6 === 0
            ? `https://medivisitas.local/audio/visita-${i}.webm`
            : null,
        motivoCancelamento:
          status === "CANCELADA" ? "Agenda do profissional alterada." : null,
        motivoNaoRealizacao:
          status === "NAO_REALIZADA"
            ? "Profissional em procedimento no horario."
            : null,
        organizationId: org.id,
      },
    });
    visitas.push(visita);

    if (status === "REALIZADA") {
      const usados = [pick(materiais, i), pick(materiais, i + 3)];
      for (const material of usados) {
        await prisma.visitaMaterial.create({
          data: {
            visitaId: visita.id,
            materialTecnicoId: material.id,
            quantidade: 1 + (i % 3),
          },
        });
      }
    }

    await prisma.agendaItem.create({
      data: {
        userId,
        profissionalId: prof.id,
        visitaId: visita.id,
        dataHoraInicio: dataVisita,
        dataHoraFim: addMinutes(dataVisita, visita.duracaoMinutos ?? 45),
        status:
          status === "REALIZADA"
            ? "REALIZADO"
            : status === "CANCELADA"
              ? "CANCELADO"
              : status === "NAO_REALIZADA"
                ? "CANCELADO"
                : i % 3 === 0
                  ? "CONFIRMADO"
                  : "PLANEJADO",
        prioridade: pick(["BAIXA", "MEDIA", "ALTA", "URGENTE"], i),
        observacoes: `Agenda demo gerada para teste visual (${pick(objetivos, i)}).`,
        organizationId: org.id,
      },
    });
  }

  for (let i = 0; i < 35; i++) {
    const prof = pick(profissionais, i * 17);
    const inicio = addDays(now, 40 + (i % 30), 9 + (i % 7), i % 2 ? 30 : 0);
    await prisma.agendaItem.create({
      data: {
        userId: pick(membros, i),
        profissionalId: prof.id,
        dataHoraInicio: inicio,
        dataHoraFim: addMinutes(inicio, 45),
        status: i % 4 === 0 ? "CONFIRMADO" : "PLANEJADO",
        prioridade: pick(["MEDIA", "ALTA", "URGENTE", "BAIXA"], i),
        observacoes: "Agendamento avulso para testar calendario e sugestoes.",
        organizationId: org.id,
      },
    });
  }

  const notificacoesSeed = [
    [
      "VISITA_HOJE",
      "ALTA",
      "Visitas de hoje",
      "Voce tem visitas importantes programadas para hoje.",
    ],
    [
      "VISITA_ATRASADA",
      "URGENTE",
      "Agenda atrasada",
      "Existe uma visita planejada que ainda nao foi concluida.",
    ],
    [
      "SEM_VISITA_30_DIAS",
      "NORMAL",
      "Sem visita recente",
      "Alguns profissionais estao ha mais de 30 dias sem contato.",
    ],
    [
      "SEM_VISITA_60_DIAS",
      "ALTA",
      "Relacionamento esfriando",
      "Profissionais estrategicos passaram de 60 dias sem visita.",
    ],
    [
      "PROSPECTADO_PENDENTE",
      "INFO",
      "Prospectados pendentes",
      "Ha prospectados aguardando primeira visita.",
    ],
    [
      "SISTEMA",
      "INFO",
      "Demo carregada",
      "Massa de dados criada para validar todas as telas.",
    ],
  ];
  for (let i = 0; i < 36; i++) {
    const prof = pick(profissionais, i * 19);
    const visita = pick(visitas, i * 7);
    const [tipo, prioridade, titulo, mensagem] = pick(notificacoesSeed, i);
    await prisma.notificacao.create({
      data: {
        userId: targetUser.clerkId,
        tipo,
        prioridade,
        titulo,
        mensagem,
        lida: i % 4 === 0,
        lidaEm: i % 4 === 0 ? addDays(now, -i, 15) : null,
        profissionalId: prof.id,
        visitaId: visita.id,
        organizationId: org.id,
        createdAt: addDays(now, -i, 8 + (i % 10)),
      },
    });
  }

  const metas = [
    [
      "Meta mensal de visitas",
      "Acompanhar volume de visitas realizadas no mes.",
      -12,
      18,
      80,
      20,
      8,
      "PROFISSIONAL",
      targetUser.clerkId,
      "ATIVA",
    ],
    [
      "Avancos de pipeline",
      "Elevar interessados para prescritores e fidelizados.",
      -20,
      10,
      45,
      35,
      10,
      "PROFISSIONAL",
      targetUser.clerkId,
      "ATIVA",
    ],
    [
      "Novos prescritores",
      "Consolidar profissionais em prescricao ativa.",
      -45,
      -3,
      35,
      25,
      12,
      "PROFISSIONAL",
      targetUser.clerkId,
      "ATINGIDA",
    ],
    [
      "Meta da equipe comercial",
      "Distribuir visitas entre representantes da equipe.",
      -10,
      22,
      160,
      55,
      20,
      "EQUIPE",
      targetUser.clerkId,
      "ATIVA",
    ],
    [
      "Recuperacao de relacionamento",
      "Reativar profissionais sem visita recente.",
      -75,
      -20,
      50,
      30,
      6,
      "EQUIPE",
      targetUser.clerkId,
      "EXPIRADA",
    ],
    [
      "Proximo mes - expansao",
      "Planejamento antecipado para novos territorios.",
      18,
      50,
      120,
      40,
      15,
      "EQUIPE",
      targetUser.clerkId,
      "ATIVA",
    ],
  ];
  for (const [
    nome,
    descricao,
    inicio,
    fim,
    metaVisitas,
    metaAvancosPipeline,
    metaPrescritores,
    plano,
    responsavelId,
    status,
  ] of metas) {
    await prisma.meta.create({
      data: {
        nome,
        descricao,
        dataInicio: addDays(now, inicio, 0),
        dataFim: addDays(now, fim, 23, 59),
        metaVisitas,
        metaAvancosPipeline,
        metaPrescritores,
        responsavelId,
        criadaPorId: targetUser.clerkId,
        plano,
        status,
        organizationId: org.id,
      },
    });
  }

  for (let i = 0; i < equipeSeed.length; i++) {
    const userId = equipeSeed[i][0];
    await prisma.organizationTranscricaoCota.create({
      data: {
        organizationId: org.id,
        userId,
        limite: [70, 55, 45, 35][i],
      },
    });
  }
  for (let i = 0; i < 37; i++) {
    await prisma.organizationTranscricaoUso.create({
      data: {
        organizationId: org.id,
        userId: pick(membros, i),
        visitaId: pick(visitas, i).id,
        createdAt: addDays(now, -(i % 20), 10 + (i % 8)),
      },
    });
  }

  const convites = [
    "marina.expansao@demo.medivisitas.local",
    "rafael.norte@demo.medivisitas.local",
    "bianca.sul@demo.medivisitas.local",
    "thiago.keyaccounts@demo.medivisitas.local",
  ];
  for (let i = 0; i < convites.length; i++) {
    await prisma.organizationConvite.create({
      data: {
        organizationId: org.id,
        email: convites[i],
        convidadoPorUserId: targetUser.clerkId,
        aceito: false,
        expiradoEm: addDays(now, 7 + i, 23, 59),
      },
    });
  }

  const relatorios = [
    {
      nome: "Visitas do mes por status",
      tipo: "visitas",
      config: {
        colunas: [
          "dataVisita",
          "profissional",
          "especialidade",
          "status",
          "duracaoMinutos",
        ],
        filtros: {},
      },
    },
    {
      nome: "Profissionais estrategicos",
      tipo: "profissionais",
      config: {
        colunas: [
          "nome",
          "crm",
          "especialidade",
          "potencial",
          "estagioPipeline",
          "cidade",
        ],
        filtros: { potenciais: ["ESTRATEGICO", "ALTO"] },
      },
    },
    {
      nome: "Movimentacoes de pipeline",
      tipo: "pipeline",
      config: {
        colunas: [
          "profissional",
          "especialidade",
          "estagioAtual",
          "estagioAnterior",
          "dataTransicao",
          "diasNoEstagio",
        ],
        filtros: {},
      },
    },
  ];
  for (const rel of relatorios) {
    await prisma.$executeRaw`
      INSERT INTO "RelatorioSalvo" ("id", "userId", "organizationId", "nome", "tipo", "config", "createdAt", "updatedAt")
      VALUES (${randomUUID()}, ${targetUser.clerkId}, ${org.id}, ${rel.nome}, ${rel.tipo}, ${JSON.stringify(rel.config)}::jsonb, now(), now())
    `;
  }

  const summary = {
    organizationId: org.id,
    targetClerkId: targetUser.clerkId,
    membros: membros.length,
    especialidades: especialidades.length,
    subEspecialidades: subEspecialidades.length,
    materiais: materiais.length,
    profissionais: profissionais.length,
    visitas: visitas.length,
    agendaAvulsa: 35,
    notificacoes: 36,
    metas: metas.length,
    relatorios: relatorios.length,
  };

  console.log(JSON.stringify(summary, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
