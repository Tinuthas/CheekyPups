
import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { $ref, DogInput, DogOwnerInput, DogVaccineInput } from "./Dog.schema";

export async function dogRoutes(app: FastifyInstance) {

  app.get('/', {preHandler: [app.authenticate]}, getAllDogs)

  app.post('/', {
    schema: {
      body: $ref('createDogBody'),
    },
    preHandler: [app.authenticate]
  }, createDogSimple)

  app.post('/owner', {
    schema: {
      body: $ref('createOwnerDogBody'),
    },
    preHandler: [app.authenticate]
  }, createDogAndOwnerHandle)

  app.post('/vaccine', {
    schema: {
      body: $ref('createDogVaccineBody'),
    },
    preHandler: [app.authenticate]
  }, createDogVaccineHandle)
    
   
}

async function getAllDogs() {
  return await prisma.dog.findMany()
}

async function createDogAndOwnerHandle(request: FastifyRequest<{Body: DogOwnerInput}>, reply: FastifyReply) {
  try{
    return await createDogAndOwner(request.body)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in create dog and owner')
  }
}

async function createDogVaccineHandle(request: FastifyRequest<{Body: DogVaccineInput}>, reply: FastifyReply) {
  try{
    return await createDogWithVaccine(request.body)
  }catch(err) {
    console.log(err)
    reply.code(400).send(err)
  }
}

async function createDogSimple(request: FastifyRequest<{Body: DogInput}>, reply: FastifyReply) {
  try{
    return await createDog(request.body)
  }catch(err) {
    console.log(err)
    reply.code(400).send(err)
  }
}

async function createDogAndOwner(input: DogOwnerInput) {
  const {
    nameOwner, phoneOne, phoneTwo, emailAddress, address, nameDog,
    birthdayDate, gender, colour, breed, dateVaccine, typeVaccine
  } = input

  const parsedBirthday = dayjs(birthdayDate).startOf('day')
  const parsedVaccine = dayjs(dateVaccine).startOf('day')

  console.log('create dog')
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

async function createDogWithVaccine(input: DogVaccineInput) {
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


async function createDog(input: DogInput) {
  const { owner_id, name, birthdayDate, gender, colour, breed} = input

  var parsedBirthday = null
  if(birthdayDate != null) {
    parsedBirthday = dayjs(birthdayDate).startOf('day').toISOString()
  }
  

  let dog = await prisma.dog.create({
    data:{
      name,
      birthdayDate: parsedBirthday,
      gender,
      colour,
      breed,
      Owner: {
        connect: {
          id: owner_id
        }
      },
    }
  })

  return dog
}