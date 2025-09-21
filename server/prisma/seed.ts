import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function run() {
  await prisma.user.deleteMany({
    where: {
      email: {
          in: '@admin'
      }
  }
  })

  await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@admin.com',
        name: 'Admin User',
        admin: true,
        password: '96b02f0ac9f8e6d1d0b702414ce7c632a67c6b2c94e5f476e44f9853af9032e7579108c745f7488c0adf99f6ca340ac0177516ea6da6c694e904eda8c265378f',
        salt: 'cb5952d265424e47609f2134dd96d85e'
      }
    }),
  ])
}

run()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })