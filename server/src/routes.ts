import { prisma } from './lib/prisma'
import { FastifyInstance} from 'fastify'
import { z } from 'zod'
import dayjs from 'dayjs'

export async function appRoutes(app: FastifyInstance){

  app.get('/dogs', async () => {
    var dogs = await prisma.dog.findMany()
    return dogs
  })

  app.get('/owners', async () => {
    var owners = await prisma.owner.findMany()
    return owners
  })

  app.post('/attendance', async (request) => {
    const createAttendanceBody = z.object({
      owner_id: z.string(),
      dog_id: z.string(),
      date: z.string(),
      fullDay: z.boolean(),
      value: z.number(),
      descriptionValue: z.string()
    })
    const {owner_id, dog_id, date, fullDay, value, descriptionValue} = createAttendanceBody.parse(request.body)

    const parsedDate = dayjs(date).startOf('day')

    let attendance = await prisma.attendance.create(
      {
        data: {
          fullDay,
          day: {
            connectOrCreate: {
              where: {
                date: parsedDate.toISOString(),
              },
              create: {
                date: parsedDate.toISOString(),
              }
            }
          },
          dog: {
            connect: {
              id: dog_id
            }
          },
          extract : {
            create: {
              value,
              description: descriptionValue,
              Owner: {
                connect: {
                  id: owner_id
                }
              }
              
            }
          }
          
        },
        include: {
          day: true,
          dog: true,
          extract: true
        }
      }
    )

    return attendance
  })

  app.get('/owner/total', async (request) => {

    const getOwnerParams = z.object({
      owner_id: z.string()
    })

    const { owner_id } = getOwnerParams.parse(request.query) 

    let total = await prisma.extract.aggregate({
      _sum: {
        value: true,
      },
      where: {
        ownerId: owner_id
      }
    })

    return ({total: total._sum.value})
  })

}

