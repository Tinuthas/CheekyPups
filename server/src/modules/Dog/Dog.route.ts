
import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { $ref, DogInput, DogOwnerInput } from "./Dog.schema";

export async function dogRoutes(app: FastifyInstance) {

  app.get('/', {preHandler: [app.authenticate]}, getAllDogs)

  app.post('/', {
    schema: {
      body: $ref('createOwnerDogBody'),
    },
    preHandler: [app.authenticate]
  }, createDogAndOwnerHandle)

  app.post('/other', {
    schema: {
      body: $ref('createDogBody'),
    },
    preHandler: [app.authenticate]
  }, createDogHandle)
    
   
}

async function getAllDogs() {
  return await prisma.dog.findMany()
}

async function createDogAndOwnerHandle(request: FastifyRequest<{Body: DogOwnerInput}>, reply: FastifyReply) {
  try{
    return await createDogAndOwner(request.body)
  }catch(err) {
    reply.code(400).send('Error in create dog and owner')
  }
}

async function createDogHandle(request: FastifyRequest<{Body: DogInput}>, reply: FastifyReply) {
  try{
    return await createDog(request.body)
  }catch(err) {
    reply.code(400).send('Error in create dog')
  }
}

async function createDogAndOwner(input: DogOwnerInput) {
  const {
    nameOwner, phoneOne, phoneTwo, emailAddress, address, nameDog,
    birthdayDate, gender, colour, breed, dateVaccine, typeVaccine
  } = input

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
}

async function createDog(input: DogInput) {
  const {
    owner_id, nameDog, birthdayDate, gender, colour, breed, dateVaccine, typeVaccine
  } = input

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
}