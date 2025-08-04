const { PrismaClient } = require("@prisma/client")
const data = require("./products.json")
const prisma = new PrismaClient()

async function main() {
  for (const item of data) {
    await prisma.product.create({
      data: item,
    })
  }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
