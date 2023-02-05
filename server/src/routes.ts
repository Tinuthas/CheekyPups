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
              date: dayjs().toISOString(),
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

  app.post('/owner/pay', async (request) => {
    const createOwnerPayBody = z.object({
      owner_id: z.string(),
      value: z.number(),
      descriptionValue: z.string()
    })
    const {owner_id, value, descriptionValue} = createOwnerPayBody.parse(request.body)

    var date = dayjs().toISOString()

    let extract = await prisma.extract.create({
      data: {
        Owner: {
          connect: {
            id: owner_id
          }
        },
        value,
        description: descriptionValue,
        date
      }
    })
    return extract
  })

  app.post('/dogs', async (request) => {
    const createOwnerDogBody = z.object({
      nameOwner: z.string(),
      phoneOne: z.string(),
      phoneTwo: z.string().nullable(),
      emailAddress: z.string(),
      address: z.string().nullable(),
      nameDog: z.string(),
      birthdayDate: z.coerce.date().nullable(),
      gender: z.string().nullable(),
      colour: z.string().nullable(),
      breed: z.string(),
      dateVaccine: z.coerce.date(),
      typeVaccine: z.string()
    })
    const {
      nameOwner, phoneOne, phoneTwo, emailAddress, address, nameDog,
      birthdayDate, gender, colour, breed, dateVaccine, typeVaccine
    } = createOwnerDogBody.parse(request.body)

    const parsedBirthday = dayjs(birthdayDate).startOf('day')
    const parsedVaccine = dayjs(dateVaccine).startOf('day')

    let dog = await prisma.dog.create({
      data:{
        name: nameDog,
        birthdayDate: parsedBirthday.toISOString(),
        gender,
        colour,
        breed,
        Owner: {
          create: {
            name: nameOwner,
            phoneOne,
            phoneTwo,
            emailAddress,
            address
          }
        },
        vaccines: {
          create: {
            dateVaccine: parsedVaccine.toISOString(),
            type: typeVaccine
          }
        }
      }
    })

    return dog
  })


  app.post('/dogs/other', async (request) => {
    const createOwnerDogBody = z.object({
      owner_id: z.string(),
      nameDog: z.string(),
      birthdayDate: z.coerce.date(),
      gender: z.string(),
      colour: z.string(),
      breed: z.string(),
      dateVaccine: z.coerce.date(),
      typeVaccine: z.string()
    })
    const {
      owner_id, nameDog, birthdayDate, gender, colour, breed, dateVaccine, typeVaccine
    } = createOwnerDogBody.parse(request.body)

    const parsedBirthday = dayjs(birthdayDate).startOf('day')
    const parsedVaccine = dayjs(dateVaccine).startOf('day')

    let dog = await prisma.dog.create({
      data:{
        name: nameDog,
        birthdayDate: parsedBirthday.toISOString(),
        gender,
        colour,
        breed,
        Owner: {
          connect: {
            id: owner_id
          }
        },
        vaccines: {
          create: {
            dateVaccine: parsedVaccine.toISOString(),
            type: typeVaccine
          }
        }
      }
    })

    return dog
  })

  app.post('/vaccine', async (request) => {
    const createVaccineBody = z.object({
      dog_id: z.string(),
      dateVaccine: z.coerce.date(),
      typeVaccine: z.string()
    })
    const {
      dog_id, dateVaccine, typeVaccine
    } = createVaccineBody.parse(request.body)

    const parsedVaccine = dayjs(dateVaccine).startOf('day')

    let vaccine = await prisma.vaccine.create({
      data:{
        dateVaccine: parsedVaccine.toISOString(),
        type: typeVaccine,
        dog: {
          connect: {
            id: dog_id
          }
        }
      }
    })

    return vaccine
  })


}

