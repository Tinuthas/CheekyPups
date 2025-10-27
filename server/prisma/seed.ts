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
        email: 'info@cheekypups.com',
        name: 'Main User',
        admin: true,
        password: '5a35e5d0111a8994609454b6351b5088982af2985e54b4f4198382ee22968556f8a68ec41e4528699987d123f2ea1fbf62cc1b8469477d8af99b4dbe76ee90ab',
        salt: '9d61eca4d8c235a1596bda8cc0240c3a'
      }
    }),
    prisma.user.create({
      data: {
        email: 'declanplyne@gmail.com',
        name: 'Declan Lyne',
        admin: true,
        password: 'adfd5636188a3848eb3e21984839bd2722eb9c614a15e745e4507deb84ee2fc01eb9b20b7371f8526c40235878b88772c9ff509f9e6876f7d3fb99dd8f604d96',
        salt: '4245dffdc2db8cc11214047648e96148'
      }
    }),
    prisma.preferences.create({
      data: {
        key: "FullDayBooking",
        value: `[\'09:30\',\'09:30\',\'11:00\',\'11:00\',\'12:30\',\'12:30\']`
      }
    })

    
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