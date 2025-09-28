import { Decimal } from "@prisma/client/runtime";
import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { $ref, PayOwnerInput, TotalOwnerInput, UpdatePaymentInput } from "./Payment.schema";

export async function paymentRoutes(app: FastifyInstance) {

  app.post('/',{
    schema: {
      body: $ref('createPayBody'),
    },
    preHandler: [app.authenticate]
  }, ownerPayHandle)

  app.put('/',{
    schema: {
      body: $ref('updatePaymentBody'),
      querystring: $ref('updatePaymentId'),
    },
    preHandler: [app.authenticate]
  }, updatePaymentHandle)
  
  app.get('/', {preHandler: [app.authenticate]}, getAllPayments)

  app.get('/extracts', {
    schema: {
      params: {
        id: { type: 'number' },
      },
    }
  }, getAllExtractByOwner)

  app.get('/total', {
    preHandler: [app.authenticate]
  } ,getTotalHandle)

  app.post('/pay',{
    schema: {
      body: $ref('createPayBody'),
      response: { 200: $ref('payResponseSchema') }
    },
    preHandler: [app.authenticate]}, ownerPayHandle)

  app.delete('/', {
    schema: {
      params: {
        id: { type: 'number' },
      },
    }
  }, deletePaymentHandle)
  
}

async function getAllPayments(request: FastifyRequest, reply: FastifyReply) {
  try{
    //return ""
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
    })

    let ids = pays.map((obj) => obj.ownerId);
    
    const payments = await prisma.owner.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        dogs: {
          select: {
            name: true,
          }
        }
      }
    })

    var listPayments: { id: number; name: string; dogsName: string, extracts: number; total: Decimal | null; }[] = []
    payments.forEach((element, index) => {

      //var dogsName = element.dogs.map(dog => dog.name).join(' - ')

      listPayments.push({
        id: element.id,
        name: element.name,
        dogsName: element.dogs.map(dog => dog.name).join(' - '),
        extracts: pays[index]._count.id,
        total: pays[index]._sum.value
      })
    })

    console.log("")
    return listPayments
  }catch(err) {
    reply.code(400).send('Error in get the total by other')
  }
}

async function getAllExtractByOwner(request: FastifyRequest<{Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    const extracts = await prisma.extract.findMany({
      where: {
        ownerId: Number(request.query.id)
      },
      orderBy: {
        date: 'desc'
      }
    })

    const filterExtracts = extracts.map(({ id, description, value, date, attendanceId}) => ({ 
      id,
      description, 
      value, 
      date: dayjs(date).format('DD/MM/YYYY HH:mm'), 
      attendanceId,
    }));
    return filterExtracts
  }catch(err) {
    reply.code(400).send('Error in get extracts from the owner')
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
    console.log(err)
    reply.code(400).send('Error in payment')
  }
}

async function updatePaymentHandle(request: FastifyRequest<{Body: UpdatePaymentInput, Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    return await updatePayment(request.body, request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error update payment')
  }
}

async function deletePaymentHandle(request: FastifyRequest<{Querystring: {id:number}}>, reply: FastifyReply ) {
  try{
    return await deletePayment(request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in delete payment')
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

async function updatePayment(input: UpdatePaymentInput, id: number) {

  const {description, value } = input
  var date = dayjs().toISOString()

  const extract = await prisma.extract.update({
    where: {
      id: Number(id),
    },
    data: {
      description,
      value,
      date
    }
  })
  return extract
}

async function deletePayment(id: number) {
  const deletePayment = await prisma.extract.delete({
    where: {
      id: Number(id)
    },
  })
  return deletePayment
}
