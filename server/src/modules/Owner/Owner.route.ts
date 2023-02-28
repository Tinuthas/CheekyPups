import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { string } from "zod";
import { prisma } from "../../lib/prisma";
import { $ref, PayOwnerInput, TotalOwnerInput, UpdateOwnerInput } from "./Owner.schema";

export async function ownerRoutes(app: FastifyInstance) {
  
  app.get('/', {preHandler: [app.authenticate]}, getAllOwners)

  app.put('/', {
    schema: {
      body: $ref('updateOwnerBody'),
      querystring: $ref('updateOwnerId'),
    },
    preHandler: [app.authenticate]}, updateOwnerHandle)
  
  app.get('/total', {
    preHandler: [app.authenticate]
  } ,getTotalHandle)

  app.post('/pay',{
    schema: {
      body: $ref('createOwnerPayBody'),
      response: {
        200: $ref('ownerPayResponseSchema')
      }
    },
    preHandler: [app.authenticate]}, ownerPayHandle)
}

async function getAllOwners() {
  return await prisma.owner.findMany()
}

async function getTotalHandle(request: FastifyRequest<{Querystring: TotalOwnerInput}>, reply: FastifyReply) {
  try{
    return await getTotalOwner(request.query)
  }catch(err) {
    reply.code(400).send('Error in get the total by other')
  }
}

async function ownerPayHandle(request: FastifyRequest<{Body: PayOwnerInput}>, reply: FastifyReply) {
  try{
    const {value} = request.body
    if(value === 0) {
      return reply.code(400).send('Value needs to be different')
    }
    return await addValueExtract(request.body)
  }catch(err) {
    reply.code(400).send('Error in do the payment in the api')
  }
}

async function updateOwnerHandle(request: FastifyRequest<{Body: UpdateOwnerInput, Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    return await updateOwner(request.body, request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in update user')
  }
}

async function getTotalOwner(input: TotalOwnerInput){
  const { owner_id } = input

  let total = await prisma.extract.aggregate({
    _sum: {
      value: true,
    },
    where: {
      ownerId: owner_id
    }
  })

  return ({total: total._sum.value})
}

async function addValueExtract(input: PayOwnerInput) {
  const {owner_id, value, description} = input

  var date = dayjs().toISOString()

  let extract = await prisma.extract.create({
    data: {
      Owner: {
        connect: {
          id: owner_id
        }
      },
      value,
      description,
      date
    }
  })
  return extract
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