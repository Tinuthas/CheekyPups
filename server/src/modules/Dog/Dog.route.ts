
import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { request } from "http";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { $ref, DogInput, DogOwnerInput, DogProfileInput, DogVaccineInput, FilterDogInput, UpdateDogInput } from "./Dog.schema";

export async function dogRoutes(app: FastifyInstance) {

  app.get('/', {preHandler: [app.authenticate]}, getAllDogs)

  app.get('/select', {
    schema: {
      querystring: $ref('filterDogName')
    },
    preHandler: [app.authenticate]
  }, getSearchDogsHandle)

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

  app.put('/', {
    schema: {
      body: $ref('updateDogBody'),
      querystring: $ref('updateDogId'),
    },
    preHandler: [app.authenticate]
  }, updateDogHandle)

  app.put('/profile', {
    schema: {
      body: $ref('updateDogProfileBody'),
      querystring: $ref('updateDogId'),
    },
    preHandler: [app.authenticate]
  }, updateDogProfileHandle)

  app.delete('/', {
    schema: {
      params: {
        id: { type: 'number' }, // converts the id param to number
      },
    }
  }, deleteDogHandle)    
   
}

async function getAllDogs() {
  var dogs = await prisma.dog.findMany({
    include: {
      Owner: {
        select: {
          name: true,
        },
      },
    },
  })

  const filterDogs = dogs.map(({ id, name, surname, birthdayDate, gender, colour, breed, avatarUrl, ownerId, Owner }) => 
  ({ id, name, surname: (surname != null ? surname : ""), birthdayDate, gender, colour, breed, avatarUrl, ownerId, owner: Owner.name }));

  return filterDogs
}

async function getSearchDogsHandle(request: FastifyRequest<{Querystring: FilterDogInput}>, reply: FastifyReply) {
  try{
    return await getSearchByName(request.query.name)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in search owner by name')
  }
}


async function getSearchByName(name:string) {
  const result = await prisma.dog.findMany({
    take: 5,
    where: {
      OR: [
        { name: { contains: name} },
        { surname: { contains: name } }
      ]
    },
    select: {
      id: true,
      name: true,
      surname: true
    },
    orderBy: {
      id: "desc",
    }
  })
  return result
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
  var { owner_id, name, surname, birthdayDate, gender, colour, breed} = input

  if(surname != null && surname.trim() == "")
    surname = null

  var parsedBirthday = null
  if(birthdayDate != null) {
    var dateParts:any[] = birthdayDate.split('/')
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
    parsedBirthday = dayjs(dateObject).startOf('day').toISOString()
  }

  let dog = await prisma.dog.create({
    data:{
      name,
      surname,
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

async function updateDogHandle(request: FastifyRequest<{Body: UpdateDogInput, Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    return await updateDog(request.body, request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in update dog')
  }
}

async function updateDog(input: UpdateDogInput, id: number) {
  var {name, surname, birthdayDate, gender, colour, breed} = input

  if(surname != null && surname.trim() == "")
    surname = null

  var parsedBirthday = null
  if(birthdayDate != null) {
    var dateParts:any[] = birthdayDate.split('/')
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
    parsedBirthday = dayjs(dateObject).startOf('day').toISOString()
  }

  let dog = await prisma.dog.update({
    where: {
      id: id
    },
    data: {name, surname, birthdayDate: parsedBirthday, gender, colour, breed}
  })

  return dog
}

async function deleteDogHandle(request: FastifyRequest<{Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    return await deleteDog(request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in delete dog')
  }
}

async function deleteDog(id: number) {
  const deleteDog = await prisma.dog.delete({
    where: {
      id: Number(id)
    },
  })
  return deleteDog
}

async function updateDogProfileHandle(request: FastifyRequest<{Body: DogProfileInput ,Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    return await updateDogProfile(request.body, request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in delete dog')
  }
}

async function updateDogProfile(input: DogProfileInput, id: number) {
  const dog = await prisma.dog.update({
    where: {
      id: Number(id)
    },
    data: {
      avatarUrl: input.avatarUrl
    }
  })

  return dog
}


