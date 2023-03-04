import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { string } from "zod";
import { prisma } from "../../lib/prisma";
import { $ref, UpdateOwnerInput } from "./Owner.schema";

export async function ownerRoutes(app: FastifyInstance) {
  
  app.get('/', {preHandler: [app.authenticate]}, getAllOwners)

  app.put('/', {
    schema: {
      body: $ref('updateOwnerBody'),
      querystring: $ref('updateOwnerId'),
    },
    preHandler: [app.authenticate]}, updateOwnerHandle)
}

async function getAllOwners() {
  return await prisma.owner.findMany()
}


async function updateOwnerHandle(request: FastifyRequest<{Body: UpdateOwnerInput, Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    return await updateOwner(request.body, request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in update user')
  }
}

async function updateOwner(input: UpdateOwnerInput, id: number) {
  const {phoneOne, phoneTwo, emailAddress, name, address} = input
  
  let owner = await prisma.owner.update({
    where: {
      id: id
    },
    data: {
      phoneOne,
      phoneTwo,
      emailAddress,
      name,
      address
    }
  })

  return owner
}