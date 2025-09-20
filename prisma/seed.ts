import { PrismaClient } from "@prisma-client/client";

const prisma = new PrismaClient();
async function main() {
  await prisma.status.createMany({
    data: [
      {
        name: "Todo",
        sortOrder: 0,
      },
      {
        name: "Doing",
        sortOrder: 1,
      },
      {
        name: "Finished",
        sortOrder: 2,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
