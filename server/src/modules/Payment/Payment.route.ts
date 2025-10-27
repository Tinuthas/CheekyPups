import { Decimal } from "@prisma/client/runtime";
import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { $ref, CreateNewTillInput, CreatePaymentOwnerAllInput, PaidOwnerInput, PayOwnerInput, TotalOwnerInput, UpdatePaymentInput } from "./Payment.schema";

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

  app.post('/owner', {
    schema: {
      body: $ref('createPaymentOwnerAll'),
    },
    preHandler: [app.authenticate]
  }, ownerPayingAllHandle)

  app.get('/till', {
    preHandler: [app.authenticate]
  }, getLastTillChangesHandle)

  app.post('/till', {
    schema: {
      body: $ref('createTillNewDate'),
    },
    preHandler: [app.authenticate]
  }, creatingNewTillChangeHandle)

}

async function getAllPayments(request: FastifyRequest<{ Querystring: { all: boolean, done: boolean, startDate: string, endDate: string } }>, reply: FastifyReply) {
  try {
    const { all, done, startDate, endDate } = request.query
    const parsedDateStart = dayjs(startDate).toISOString()
    const parsedDateEnd = dayjs(endDate).toISOString()
    if (all) {
      return await getAllExtractsRole(parsedDateStart, parsedDateEnd)
    } else if (done) {
      return await getAllExtractsByDoneDate(done, parsedDateStart, parsedDateEnd)
    } else {
      return await getAllExtractsByDone(done)
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

  return await filterAllExtracts(pays)
}

async function getAllExtractsByDone(done: boolean) {

  const pays = await prisma.extract.groupBy({
    by: ['ownerId'],
    where: {
      done,
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

  return await filterAllExtracts(pays)
}

async function getAllExtractsByDoneDate(done: boolean, startDate: string, endDate: string) {

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

  return await filterAllExtracts(pays)
}

async function filterAllExtracts(pays: any[]) {
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

async function getAllExtractByOwner(request: FastifyRequest<{ Querystring: { id: number, all: boolean, done: boolean, startDate: string, endDate: string } }>, reply: FastifyReply) {
  try {
    const { id, all, done, startDate, endDate } = request.query
    const parsedDateStart = dayjs(startDate).toISOString()
    const parsedDateEnd = dayjs(endDate).toISOString()
    if (all) {
      return await getAllExtractByOwnerAll(id, parsedDateStart, parsedDateEnd)
    } else if (done) {
      return await getAllExtractByOwnerDoneDate(done, id, parsedDateStart, parsedDateEnd)
    } else {
      return await getAllExtractByOwnerDone(done, id)
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
    },
    select: {
      id: true,
      description: true,
      value: true,
      date: true,
      attendanceId: true,
      paidValue: true,
      totalValue: true,
      done: true,
      type: true,
      attendance: {
        select: {
          dog: {
            select: {
              name: true,
            }
          }
        }
      },
      booking: {
        select: {
          dog: {
            select: {
              name: true,
            }
          }
        }
      }
    }
  })
  return await filterAllExtractByOwner(extracts, Number(id))
}

async function getAllExtractByOwnerDone(done: boolean, id: number) {
  const extracts = await prisma.extract.findMany({
    where: {
      ownerId: Number(id),
      done,
    },
    orderBy: {
      id: 'desc'
    },
    select: {
      id: true,
      description: true,
      value: true,
      date: true,
      attendanceId: true,
      paidValue: true,
      totalValue: true,
      done: true,
      type: true,
      attendance: {
        select: {
          dog: {
            select: {
              name: true,
            }
          }
        }
      },
      booking: {
        select: {
          dog: {
            select: {
              name: true,
            }
          }
        }
      }
    }
  })
  return await filterAllExtractByOwner(extracts, Number(id))
}

async function getAllExtractByOwnerDoneDate(done: boolean, id: number, startDate: string, endDate: string) {
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
    },
    select: {
      id: true,
      description: true,
      value: true,
      date: true,
      attendanceId: true,
      paidValue: true,
      totalValue: true,
      done: true,
      type: true,
      attendance: {
        select: {
          dog: {
            select: {
              name: true,
            }
          }
        }
      },
      booking: {
        select: {
          dog: {
            select: {
              name: true,
            }
          }
        }
      }
    }
  })

  return await filterAllExtractByOwner(extracts, Number(id))
}

async function filterAllExtractByOwner(extracts: any[], ownerId: number) {
  const filterExtracts = extracts.map(({ id, description, value, date, attendanceId, paidValue, totalValue, done, type, attendance, booking, }) => ({
    id,
    description,
    value,
    date: dayjs(date).format('DD/MM/YYYY HH:mm'),
    attendanceId,
    paidValue,
    totalValue,
    done,
    type,
    dogName: attendance != null ? attendance.dog.name : booking != null ? booking.dog.name : ""
  }));

  const ownerInfo = await prisma.owner.findUnique({
    where: { id: ownerId },
    include: {
      dogs: true
    }
  })

  const bookings = await prisma.booking.findMany({
    where: {
      dog: {
        ownerId: ownerId
      }
    },
    orderBy: {
      dayBooking: {
        date: 'desc'
      }
    },
    select: {
      id: true,
      time: true,
      status: true,
      notes: true,
      dog: {
        select: {
          name: true,
        }
      },
      extract: {
        select: {
          value: true,
        }
      }
    },
  })

  const filterBookings = bookings.map(({ id, time, status, dog, notes, extract }) => ({
    id,
    date: dayjs(time).format('DD/MM/YYYY HH:mm'),
    dogName: dog != null ? dog.name : "",
    status: status,
    notes: notes,
    sales: extract != null ? extract.value : ""
  }));

  const pays = await prisma.extract.groupBy({
    by: ['ownerId'],
    where: {
      ownerId: ownerId,
      done: false,
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

  var totalPays: { id: number; extracts: number; value: Decimal | null; paidValue: Decimal | null; totalValue: Decimal | null; }[] = []
  pays.forEach((element, index) => {
    totalPays.push({
      id: element.ownerId,
      extracts: pays[index]._count.id,
      value: pays[index]._sum.value,
      paidValue: pays[index]._sum.paidValue,
      totalValue: pays[index]._sum.totalValue,
    })
  })


  return { extracts: filterExtracts, owner: ownerInfo, bookings: filterBookings, totalPays: totalPays }
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
    if (value <= 0) {
      return reply.code(400).send('Value needs to be bigger than 0')
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
  const { owner_id, value, description, newCustomer, customerName, customerPhone, paid, paidValue, typePaid } = input

  var date = dayjs().toISOString()

  const totalValue = value - (paid ? Number(paidValue) : 0);
  let extract = null

  if (newCustomer) {
    extract = await prisma.extract.create({
      data: {
        Owner: {
          create: {
            name: String(customerName),
            phoneOne: String(customerPhone),
            type: 'D'
          }
        },
        value,
        totalValue: totalValue,
        done: paid,
        paidValue: paid ? paidValue : 0,
        type: paid ? typePaid : null,
        description,
        date
      },
      include: {
        Owner: true
      }
    })
  } else {
    if (owner_id == null || owner_id == 0)
      throw new Error('Owner was not selected')

    extract = await prisma.extract.create({
      data: {
        Owner: {
          connect: {
            id: owner_id
          }
        },
        value,
        totalValue: totalValue,
        done: paid,
        paidValue: paid ? paidValue : 0,
        type: paid ? typePaid : null,
        description,
        date
      },
      include: {
        Owner: true
      }
    })
  }

  if (paid) {
    await updateTillHandle(extract.Owner.type == null ? 'D' : extract.Owner.type, String(typePaid), value, Number(paidValue))
  }

  return extract
}

async function addValuePaidExtract(input: PaidOwnerInput, id: number) {
  const { value, description, paidValue, done, typePaid } = input

  if (paidValue < value) {
    return new Error('Paid value needs to be bigger than the sales value')
  }

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
      done,
      type: typePaid
    }
  })

  await updateTillHandle('D', typePaid, value, paidValue)
  return extract
}

async function updatePayment(input: UpdatePaymentInput, id: number) {

  const { description, sales, paid, typePaid, paidValue } = input
  var date = dayjs().toISOString()

  const totalValue = Number(sales) - (paid ? Number(paidValue) : 0);

  const type = typePaid != null ? (typePaid.toUpperCase().includes('REV') ? 'REV' : typePaid.toUpperCase()): typePaid

  const extract = await prisma.extract.update({
    where: {
      id: Number(id),
    },
    data: {
      description,
      value: sales,
      totalValue: totalValue,
      done: paid,
      paidValue: paid ? paidValue : 0,
      type: paid ? type : null,
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


async function ownerPayingAllHandle(request: FastifyRequest<{ Body: CreatePaymentOwnerAllInput }>, reply: FastifyReply) {
  try {
    return await ownerPayingAll(request.body)
  } catch (err) {
    console.log(err)
    reply.code(400).send('Error in payment')
  }
}

async function ownerPayingAll(input: CreatePaymentOwnerAllInput) {
  const { ownerId, salesValue, paidValue, typePaid } = input

  if (paidValue < salesValue) {
    return new Error('Paid value needs to be bigger than the sales value')
  }

  const extracts = await prisma.extract.findMany({
    where: {
      ownerId: Number(ownerId),
      done: false,
    },
    orderBy: {
      id: 'asc'
    }
  })
  var date = dayjs().toISOString()
  var paidValues = paidValue
  for (let index = 0; index < extracts.length; index++) {
    if (Number(extracts[index].value) <= paidValues) {
      if (extracts[index].attendanceId != null) {
        await prisma.extract.update({
          where: { id: extracts[index].id },
          data: {
            paidValue: extracts[index].value,
            totalValue: 0,
            done: true,
            date,
            type: typePaid,
            attendance: {
              connect: {
                id: Number(extracts[index].attendanceId)
              },
              update: {
                paid: true
              }
            },
          }
        })
      } else if (extracts[index].bookingId != null) {
        await prisma.extract.update({
          where: { id: extracts[index].id },
          data: {
            paidValue: extracts[index].value,
            totalValue: 0,
            done: true,
            date,
            type: typePaid,
            booking: {
              connect: {
                id: Number(extracts[index].bookingId)
              },
              update: {
                status: 'done'
              }
            }
          }
        })
      } else {
        await prisma.extract.update({
          where: { id: extracts[index].id },
          data: {
            paidValue: extracts[index].value,
            totalValue: 0,
            done: true,
            date,
            type: typePaid,
          }
        })
      }
      paidValues = paidValues - Number(extracts[index].value)
    }
  }
  await updateTillHandle('D', typePaid, salesValue, paidValue)

}


async function getLastTillChangesHandle(request: FastifyRequest, reply: FastifyReply) {
  try {
    return await getLastTillChanges()
  } catch (err) {
    console.log(err)
    reply.code(400).send('Error in getting last changes till')
  }
}

async function getLastTillChanges() {
  var lastDaycareChanges = await prisma.till.findMany({
    where: {
      type: 'D'
    },
    orderBy: {
      id: 'desc',
    },
    take: 3,
  })

  var lastGroomingChanges = await prisma.till.findMany({
    where: {
      type: 'G'
    },
    orderBy: {
      id: 'desc',
    },
    take: 3,
  })

  var lastAllChanges = await prisma.till.findMany({
    orderBy: {
      id: 'desc',
    },
    take: 100,
  })

  return { daycare: lastDaycareChanges, grooming: lastGroomingChanges, all: lastAllChanges }
}

async function creatingNewTillChangeHandle(request: FastifyRequest<{ Body: CreateNewTillInput }>, reply: FastifyReply) {
  try {
    return await creatingNewTillChanges(request.body)
  } catch (err) {
    console.log(err)
    reply.code(400).send('Error in creating new till change')
  }
}

async function creatingNewTillChanges(input: CreateNewTillInput) {

  const { newValue, description, type } = input
  const tillChange = await prisma.till.create({
    data: {
      date: dayjs(new Date()).toISOString(),
      value: newValue,
      valueStarted: newValue,
      valueCard: 0,
      valueOther: 0,
      description: description,
      type: type
    }
  })

  await prisma.till.findFirst({
    orderBy: {
      id: 'desc',
    },
  })

  return tillChange
}

export async function updateTillHandle(typeTill: string, type: string, value: number, valuePaid: number) {
  try {
    /*if(type != 'CASH') {
      if(valuePaid != value) {
        throw new Error('Value Paid must be the same than the sales')
      }
    }*/

    const till = await prisma.till.findFirst({
      where: {
        type: typeTill,
      },
      orderBy: {
        id: 'desc'
      }
    })

    if (type == 'REV') {
      await prisma.till.update({
        where: {
          id: till?.id
        },
        data: {
          valueOther: (Number(till?.valueOther) + (valuePaid))
        }
      })
    }

    if (type == 'CARD') {
      await prisma.till.update({
        where: {
          id: till?.id
        },
        data: {
          valueCard: (Number(till?.valueCard) + (valuePaid))
        }
      })
    }

    if (type == 'CASH') {
      await prisma.till.update({
        where: {
          id: till?.id
        },
        data: {
          value: (Number(till?.value) + (valuePaid)) + ((value) - (valuePaid))
        }
      })
    }

  } catch (e:any) {
    throw new Error('Error in updating till: '+e.message)
  }
}