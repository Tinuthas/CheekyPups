import { Decimal } from "@prisma/client/runtime";
import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { $ref, PaidOwnerInput, PayOwnerInput, TotalOwnerInput, UpdatePaymentInput } from "./Payment.schema";

export async function paymentRoutes(app: FastifyInstance) {

  app.post('/', {
    schema: {
      body: $ref('createPayBody'),
    },
    preHandler: [app.authenticate]
  }, ownerPayHandle)

  app.put('/', {
    schema: {
      body: $ref('updatePaymentBody'),
      querystring: $ref('updatePaymentId'),
    },
    preHandler: [app.authenticate]
  }, updatePaymentHandle)

  app.get('/', {
    schema: {
      querystring: $ref('statusDone'),
    },
    preHandler: [app.authenticate]
  }, getAllPayments)

  app.get('/extracts', {
    schema: {
      querystring: $ref('statusDoneExtracts'),
    },
    preHandler: [app.authenticate]
  }, getAllExtractByOwner)

  app.get('/total', {
    preHandler: [app.authenticate]
  }, getTotalHandle)

  app.post('/pay', {
    schema: {
      body: $ref('createPayBody'),
      response: { 200: $ref('payResponseSchema') }
    },
    preHandler: [app.authenticate]
  }, ownerPayHandle)

  app.put('/paid', {
    schema: {
      body: $ref('createPayPaidBody'),
      querystring: $ref('updatePaymentId'),
    },
    preHandler: [app.authenticate]
  }, updatePaymentPaidHandle)

  app.delete('/', {
    schema: {
      params: {
        id: { type: 'number' },
      },
    }
  }, deletePaymentHandle)

}

async function getAllPayments(request: FastifyRequest<{ Querystring: { all: boolean, done: boolean, startDate: string, endDate: string } }>, reply: FastifyReply) {
  try {
    const { all, done, startDate, endDate } = request.query
    console.log(' ---- ' + all)
    console.log(' ---- ' + done)
    const parsedDateStart = dayjs(startDate).toISOString()
    const parsedDateEnd = dayjs(endDate).toISOString()
    console.log(' ---- ' + parsedDateStart)
    console.log(' ---- ' + parsedDateEnd)
    if (all == true) {
      return await getAllExtractsRole(parsedDateStart, parsedDateEnd)
    } else {
      return await getAllExtractsByDone(done, parsedDateStart, parsedDateEnd)
    }
  } catch (err) {
    reply.code(400).send('Error in get payments')
  }
}

async function getAllExtractsRole(startDate: string, endDate: string) {
  const pays = await prisma.extract.groupBy({
    by: ['ownerId'],
    where: {
      date: {
        lte: endDate,
        gte: startDate
      }
    },
    _count: {
      id: true,
    },
    _sum: {
      value: true,
      paidValue: true,
      totalValue: true
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

  var listPayments: { id: number; name: string; dogsName: string, extracts: number; value: Decimal | null; paidValue: Decimal | null; totalValue: Decimal | null; }[] = []
  payments.forEach((element, index) => {
    listPayments.push({
      id: element.id,
      name: element.name,
      dogsName: element.dogs.map(dog => dog.name).join(' - '),
      extracts: pays[index]._count.id,
      value: pays[index]._sum.value,
      paidValue: pays[index]._sum.paidValue,
      totalValue: pays[index]._sum.totalValue,
    })
  })
  return listPayments
}

async function getAllExtractsByDone(done: boolean, startDate: string, endDate: string) {


  const pays = await prisma.extract.groupBy({
    by: ['ownerId'],
    where: {
      done,
      date: {
        lte: endDate,
        gte: startDate
      }
    },
    _count: {
      id: true,
    },
    _sum: {
      value: true,
      paidValue: true,
      totalValue: true
    },
  })
  console.log(pays)

  console.log('htrot')

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
  console.log('htrot')

  var listPayments: { id: number; name: string; dogsName: string, extracts: number; value: Decimal | null; paidValue: Decimal | null; totalValue: Decimal | null; }[] = []
  payments.forEach((element, index) => {
    listPayments.push({
      id: element.id,
      name: element.name,
      dogsName: element.dogs.map(dog => dog.name).join(' - '),
      extracts: pays[index]._count.id,
      value: pays[index]._sum.value,
      paidValue: pays[index]._sum.paidValue,
      totalValue: pays[index]._sum.totalValue,
    })
  })
  console.log('htrot')
  console.log(listPayments)
  return listPayments
}

async function getAllExtractByOwner(request: FastifyRequest<{ Querystring: { id: number, all: boolean, done: boolean, startDate: string, endDate: string } }>, reply: FastifyReply) {
  try {
    const { id, all, done, startDate, endDate } = request.query
    const parsedDateStart = dayjs(startDate).toISOString()
    const parsedDateEnd = dayjs(endDate).toISOString()
    if (all == true) {
      return await getAllExtractByOwnerAll(id, parsedDateStart, parsedDateEnd)
    } else {
      return await getAllExtractByOwnerDone(done, id, parsedDateStart, parsedDateEnd)
    }

  } catch (err) {
    reply.code(400).send('Error in get extracts from the owner')
  }
}

async function getAllExtractByOwnerAll(id: number, startDate: string, endDate: string) {
  const extracts = await prisma.extract.findMany({
    where: {
      ownerId: Number(id),
      date: {
        lte: endDate,
        gte: startDate
      }
    },
    orderBy: {
      id: 'desc'
    }
  })

  const filterExtracts = extracts.map(({ id, description, value, date, attendanceId, paidValue, totalValue, done }) => ({
    id,
    description,
    value,
    date: dayjs(date).format('DD/MM/YYYY HH:mm'),
    attendanceId,
    paidValue,
    totalValue,
    done
  }));
  return filterExtracts
}

async function getAllExtractByOwnerDone(done: boolean, id: number, startDate: string, endDate: string) {
  const extracts = await prisma.extract.findMany({
      where: {
        ownerId: Number(id),
        done,
        date: {
          lte: endDate,
          gte: startDate
        }
      },
      orderBy: {
        id: 'desc'
      }
    })
    console.log('extract')
   

    const filterExtracts = extracts.map(({ id, description, value, date, attendanceId, paidValue, totalValue, done, type }) => ({
      id,
      description,
      value,
      date: dayjs(date).format('DD/MM/YYYY HH:mm'),
      attendanceId,
      paidValue,
      totalValue,
      done,
      type
    }));
     console.log(filterExtracts)
    return filterExtracts
}



async function getTotalHandle(request: FastifyRequest<{ Querystring: TotalOwnerInput }>, reply: FastifyReply) {
  try {
    return await getTotalOwner(request.query)
  } catch (err) {
    reply.code(400).send('Error in get the total by other')
  }
}

async function ownerPayHandle(request: FastifyRequest<{ Body: PayOwnerInput }>, reply: FastifyReply) {
  try {
    const { value } = request.body
    if (value === 0) {
      return reply.code(400).send('Value needs to be different')
    }
    return await addValueExtract(request.body)
  } catch (err) {
    console.log(err)
    reply.code(400).send('Error in payment')
  }
}

async function updatePaymentHandle(request: FastifyRequest<{ Body: UpdatePaymentInput, Querystring: { id: number } }>, reply: FastifyReply) {
  try {
    return await updatePayment(request.body, request.query.id)
  } catch (err) {
    console.log(err)
    reply.code(400).send('Error update payment')
  }
}

async function updatePaymentPaidHandle(request: FastifyRequest<{ Body: PaidOwnerInput, Querystring: { id: number } }>, reply: FastifyReply) {
  try {
    return await addValuePaidExtract(request.body, request.query.id)
  } catch (err) {
    console.log(err)
    reply.code(400).send('Error update payment')
  }
}

async function deletePaymentHandle(request: FastifyRequest<{ Querystring: { id: number } }>, reply: FastifyReply) {
  try {
    return await deletePayment(request.query.id)
  } catch (err) {
    console.log(err)
    reply.code(400).send('Error in delete payment')
  }
}

async function getTotalOwner(input: TotalOwnerInput) {
  const { owner_id } = input

  let total = await prisma.extract.aggregate({
    _sum: {
      value: true,
    },
    where: {
      ownerId: owner_id
    }
  })

  return ({ total: total._sum.value })
}

async function addValueExtract(input: PayOwnerInput) {
  const { owner_id, value, description } = input

  var date = dayjs().toISOString()

  let extract = await prisma.extract.create({
    data: {
      Owner: {
        connect: {
          id: owner_id
        }
      },
      value,
      totalValue: value,
      done: false,
      description,
      date
    }
  })
  return extract
}

async function addValuePaidExtract(input: PaidOwnerInput, id: number) {
  const { value, description, paidValue, done } = input

  var date = dayjs().toISOString()
  const totalValue = value - paidValue;

  const extract = await prisma.extract.update({
    where: {
      id: Number(id),
    },
    data: {
      description,
      value,
      date,
      paidValue,
      totalValue,
      done
    }
  })
  return extract
}

async function updatePayment(input: UpdatePaymentInput, id: number) {

  const { description, value } = input
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
