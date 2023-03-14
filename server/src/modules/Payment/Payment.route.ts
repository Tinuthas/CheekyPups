import { Decimal } from "@prisma/client/runtime";
import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { $ref, PayOwnerInput, TotalOwnerInput } from "./Payment.schema";

export async function paymentRoutes(app: FastifyInstance) {

  app.post('/',{
    schema: {
      body: $ref('totalOwnerSchema'),
    },
    preHandler: [app.authenticate]
  }, ownerPayHandle)
  
  app.get('/', {preHandler: [app.authenticate]}, getAllPayments)

  app.get('/total', {
    preHandler: [app.authenticate]
  } ,getTotalHandle)

  app.post('/pay',{
    schema: {
      body: $ref('createPayBody'),
      response: { 200: $ref('payResponseSchema') }
    },
    preHandler: [app.authenticate]}, ownerPayHandle)
  
}

async function getAllPayments(request: FastifyRequest, reply: FastifyReply) {
  try{
    /*const payments = await prisma.owner.findMany({
      where: {
        extracts: { some: {} }
      },
      select: {
        id: true,
        name: true,
      }
    })*/

    const pays = await prisma.extract.groupBy({
      by: ['ownerId'],
      _count: {
        id: true,
      },
      _sum: {
        value: true,
      },
      orderBy: {
        _sum: {
          value: 'desc',
        },
      },
    })

    let ids = pays.map((obj) => obj.ownerId);
    
    const payments = await prisma.owner.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    var listPayments: { id: number; name: string; extracts: number; total: Decimal | null; }[] = []
    payments.forEach((element, index) => {
      listPayments.push({
        id: element.id,
        name: element.name,
        extracts: pays[index]._count.id,
        total: pays[index]._sum.value
      })
    })

    return listPayments
  }catch(err) {
    reply.code(400).send('Error in get the total by other')
  }
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
