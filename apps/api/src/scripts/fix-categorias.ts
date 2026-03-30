import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const especialidades = await prisma.especialidade.findMany()

  console.log(`Encontradas ${especialidades.length} especialidades\n`)

  for (const esp of especialidades) {
    const categoriaCorrigida =
      esp.categoria.charAt(0).toUpperCase() +
      esp.categoria.slice(1).toLowerCase()

    if (categoriaCorrigida !== esp.categoria) {
      await prisma.especialidade.update({
        where: { id: esp.id },
        data: { categoria: categoriaCorrigida },
      })
      console.log(`Corrigido: "${esp.categoria}" → "${categoriaCorrigida}"`)
    }
  }

  console.log('\nConcluído!')
  await prisma.$disconnect()
}

main()