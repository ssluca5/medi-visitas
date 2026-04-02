const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const categorias = {
    Médicos: [
      "Clínico Geral",
      "Cardiologia",
      "Dermatologia",
      "Endocrinologia",
      "Gastroenterologia",
      "Neurologia",
      "Oncologia",
      "Ortopedia",
      "Pediatria",
      "Psiquiatria",
      "Reumatologia",
      "Urologia",
      "Nutricionista",
    ],
    Farmácia: [
      "Farmácia Clínica",
      "Farmácia Hospitalar",
      "Farmácia Magistral",
      "Farmácia Oncológica",
      "Farmacêutico",
    ],
    Odontologia: [
      "Cirurgia Bucomaxilofacial",
      "Endodontia",
      "Implantodontia",
      "Odontopediatria",
      "Ortodontia",
      "Periodontia",
      "Dentista",
    ],
    Outros: ["Psicologia", "Fisioterapia", "Educação Física"],
  };

  console.log("Iniciando seed de especialidades...");

  for (const [categoria, especialidades] of Object.entries(categorias)) {
    for (const nome of especialidades) {
      const id = `${categoria.toLowerCase().replace(/\s/g, "-")}-${nome.toLowerCase().replace(/\s/g, "-")}`;

      await prisma.especialidade.upsert({
        where: { id },
        update: { nome, categoria },
        create: { id, nome, categoria },
      });

      console.log(`  ✓ ${categoria}: ${nome}`);
    }
  }

  console.log("\nSeed de especialidades executado com sucesso!");

  // SubEspecialidades — mapeamento por nome da Especialidade
  const subespecialidades = {
    Nutricionista: [
      "Saúde da Mulher",
      "Nutrição Esportiva",
      "Funcional",
      "Materno Infantil",
    ],
    Cardiologia: ["Cardiologia Intervencionista", "Eletrofisiologia"],
    Pediatra: ["Neonatologia", "Adolescente"],
    Farmacêutico: ["Farmácia Clínica", "Manipulação"],
    Dentista: ["Ortodontia", "Implantodontia", "Endodontia"],
  };

  console.log("\nIniciando seed de subespecialidades...");

  for (const [espNome, subSpecs] of Object.entries(subespecialidades)) {
    const especialidade = await prisma.especialidade.findFirst({
      where: { nome: espNome, deletedAt: null },
    });
    if (!especialidade) {
      console.log(`  ! Especialidade "${espNome}" não encontrada — pulando`);
      continue;
    }
    for (const nome of subSpecs) {
      const id = `${especialidade.id}-${nome.toLowerCase().replace(/\s/g, "-")}`;
      await prisma.subEspecialidade.upsert({
        where: { id },
        update: { nome },
        create: { id, nome, especialidadeId: especialidade.id },
      });
      console.log(`  ✓ ${espNome}: ${nome}`);
    }
  }

  console.log("\nSeed de subespecialidades executado com sucesso!");

  // Materiais Técnicos
  const materiais = [
    { nome: 'Bula Produto A',             tipo: 'BULA' },
    { nome: 'Bula Produto B',             tipo: 'BULA' },
    { nome: 'Folder Cardiologia',         tipo: 'FOLDER' },
    { nome: 'Folder Neurologia',          tipo: 'FOLDER' },
    { nome: 'Apresentação Pipeline 2026', tipo: 'APRESENTACAO' },
    { nome: 'Amostra Produto A — 10mg',   tipo: 'AMOSTRA' },
    { nome: 'Amostra Produto B — 20mg',   tipo: 'AMOSTRA' },
  ];

  console.log("\nIniciando seed de materiais técnicos...");
  for (const mat of materiais) {
    const existing = await prisma.materialTecnico.findFirst({ where: { nome: mat.nome } });
    if (!existing) {
      await prisma.materialTecnico.create({ data: mat });
      console.log(`  ✓ Material: ${mat.nome}`);
    } else {
      console.log(`  - Material já existe: ${mat.nome}`);
    }
  }
  console.log("\nSeed de materiais técnicos executado com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
