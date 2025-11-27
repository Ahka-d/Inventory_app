const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient()

async function main() {
  const categoriesToSeed = [
    { name: 'Electronic' },
    { name: 'Apparel' },
    { name: 'Home Goods' },
  ];

  console.log('Iniciando el seeding de la tabla Category...');


  for (const category of categoriesToSeed) {
    await prisma.category.upsert({
      where: { name: category.name }, 
      update: {}, 
      create: category,
    });
  }

  console.log('Seeding de la tabla Category completado.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    }
    )
    .finally(async () => {
        await prisma.$disconnect();
    }
    );