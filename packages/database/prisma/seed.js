const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const categorias = {
    'Médicos': [
      'Clínico Geral',
      'Cardiologia',
      'Dermatologia',
      'Endocrinologia',
      'Gastroenterologia',
      'Neurologia',
      'Oncologia',
      'Ortopedia',
      'Pediatria',
      'Psiquiatria',
      'Reumatologia',
      'Urologia',
    ],
    'Farmácia': [
      'Farmácia Clínica',
      'Farmácia Hospitalar',
      'Farmácia Magistral',
      'Farmácia Oncológica',
    ],
    'Odontologia': [
      'Cirurgia Bucomaxilofacial',
      'Endodontia',
      'Implantodontia',
      'Odontopediatria',
      'Ortodontia',
      'Periodontia',
    ],
  };

  console.log('Iniciando seed de especialidades...');

  for (const [categoria, especialidades] of Object.entries(categorias)) {
    for (const nome of especialidades) {
      const id = `${categoria.toLowerCase().replace(/\s/g, '-')}-${nome.toLowerCase().replace(/\s/g, '-')}`;
      
      await prisma.especialidade.upsert({
        where: { id },
        update: {
          nome,
          categoria,
        },
        create: {
          id,
          nome,
          categoria,
        },
      });
      
      console.log(`  ✓ ${categoria}: ${nome}`);
    }
  }

  console.log('\nSeed de especialidades executado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
