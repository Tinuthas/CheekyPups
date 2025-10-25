import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { string } from "zod";
import { prisma } from "../../lib/prisma";
import { $ref, CreateOwnerInput, FilterOwnerInput, FilterOwnerTypeInput, UpdateOwnerInput } from "./Owner.schema";

export async function ownerRoutes(app: FastifyInstance) {
  
  app.get('/', {preHandler: [app.authenticate]}, getAllOwners)

  app.get('/type', {
    schema: {
      querystring: $ref('filterTypeOwner')
    },preHandler: [app.authenticate]},
  getAllOwnersQuery)

  app.get('/select', {
    schema: {
      querystring: $ref('filterOwnerName')
    },
    preHandler: [app.authenticate]
  }, getSearchOwnersHandle)

  app.put('/', {
    schema: {
      body: $ref('updateOwnerBody'),
      querystring: $ref('updateOwnerId'),
    },
    preHandler: [app.authenticate]
  }, updateOwnerHandle)

  app.delete('/', {
    schema: {
      params: {
        id: { type: 'number' }, // converts the id param to number
      },
    },
    preHandler: [app.authenticate]
  }, deleteOwnerHandle)

  app.post('/', {
    schema: {
      body: $ref('createOwnerSchema')
    },
    preHandler: [app.authenticate]
  }, createOwnerHandle)
}

async function getAllOwners() {
  var owners = await prisma.owner.findMany()
  return owners
}

async function getAllOwnersQuery(request:FastifyRequest<{Querystring: FilterOwnerTypeInput}>, reply: FastifyReply) {
  try{
    return await getSearchOwnerType(request.query.type)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in search owner by name')
  }
}

async function getSearchOwnersHandle(request:FastifyRequest<{Querystring: FilterOwnerInput}>, reply: FastifyReply) {
  try{
    return await getSearchByName(request.query.name)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in search owner by name')
  }
}


async function updateOwnerHandle(request: FastifyRequest<{Body: UpdateOwnerInput, Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    return await updateOwner(request.body, request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in update owner')
  }
}

async function deleteOwnerHandle(request: FastifyRequest<{Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    return await deleteOwner(request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in delete owner')
  }
}

async function createOwnerHandle(request: FastifyRequest<{Body: CreateOwnerInput}>, reply: FastifyReply) {
  try{
    return await createOwner(request.body)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in create owner')
  }
}

async function getSearchByName(name:string) {
  const result = await prisma.owner.findMany({
    take: 5,
    where: {
       OR: [
        {name: { contains: name }},
        {phoneOne: { contains: name }}
       ]
     
    },
    select: {
      id: true,
      name: true,
      phoneOne: true
    },
    orderBy: {
      id: "desc",
    }
  })
  return result
}

async function getSearchOwnerType(type: string) {
    const result = await prisma.owner.findMany({
      where: {
        type: {
          contains: type
        }
      }
    })
    return result
}

async function updateOwner(input: UpdateOwnerInput, id: number) {
  const {phoneOne, phoneTwo, type, emailAddress, name, address} = input
  
  let owner = await prisma.owner.update({
    where: {
      id: id
    },
    data: {
      phoneOne,
      phoneTwo,
      type,
      emailAddress,
      name,
      address
    }
  })

  return owner
}

async function deleteOwner(id: number) {
  const deleteOwner = await prisma.owner.delete({
    where: {
      id: Number(id)
    },
  })
  return deleteOwner
}

async function createOwner(input: UpdateOwnerInput) {
  const {name, phoneOne, type, secondOwner, phoneTwo, emailAddress, address, notes} = input

  let owner = await prisma.owner.create({
    data: {
      name,
      phoneOne,
      type,
      secondOwner,
      phoneTwo,
      emailAddress,
      address,
      notes
    }
  })

  return owner
}