import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { $ref, BookingInput, FilterBookingDateInput, DateFillSpacesBodyInput, FilterSearchingInput, BookingOfferingInput, BookingConfirmedOfferInput, BookingCreateNewCustomer, BookingCreateExistedCustomer, BookingFinishInput, BookingEditInput } from "./Booking.schema";
import { includes } from "lodash";
import { updateTillHandle } from "../Payment/Payment.route";


export async function bookingRoutes(app: FastifyInstance) {

  app.get('/', {
    schema: {
      querystring: $ref('filterBookingDate')
    },
    preHandler: [app.authenticate]
  }, getBookingByDate)

  app.post('/', {
    schema: {
      body: $ref('createBookingBody'),
    },
    preHandler: [app.authenticate]
  }, addBookingSpaceHandle)

  app.post('/all', {
    schema: {
      body: $ref('dateFillSpacesBody'),
    },
    preHandler: [app.authenticate]
  }, addBookingFillSpaceHandle)

  app.get('/select', {
    schema: {
      querystring: $ref('filterSearching')
    },
    preHandler: [app.authenticate]
  }, getSearchExistedHandle)

  app.delete('/', { preHandler: [app.authenticate] }, deleteBookingHandler)

  app.put('/cancel', { preHandler: [app.authenticate] }, cancelBookingHandler)

  app.post('/newCustomer', {
    schema: {
      body: $ref('createBookingNewCustomer'),
    },
    preHandler: [app.authenticate]
  }, addBookingNewCustomerHandle)

  app.post('/existedCustomer', {
    schema: {
      body: $ref('createBookingExistedCustomer'),
    },
    preHandler: [app.authenticate]
  }, addBookingExistedCustomerHandle)

  app.post('/offering', {
    schema: {
      body: $ref('createBookingOffering'),
    },
    preHandler: [app.authenticate]
  }, addBookingOfferingHandle)

  app.post('/confirmedOffer', {
    schema: {
      body: $ref('createBookingConfirmedOffer'),
    },
    preHandler: [app.authenticate]
  }, addBookingConfirmedOfferHandle)

  app.post('/finish', {
    schema: {
      body: $ref('createBookingFinish'),
    },
    preHandler: [app.authenticate]
  }, addBookingFinishCustomerHandle)

  app.post('/edit', {
    schema: {
      body: $ref('createEditOwner'),
    },
    preHandler: [app.authenticate]
  }, addBookingEditOwnerHandle)
}

async function getBookingByDate(request: FastifyRequest<{ Querystring: FilterBookingDateInput }>, reply: FastifyReply) {
  try {
    return await getBookingsDate(request.query)
  } catch (err) {
    reply.code(400).send('Error in get bookings appointments')
  }
}

async function getBookingsDate(input: FilterBookingDateInput) {
  const { date } = input
  const parsedDate = dayjs(date).set('hour', 0).set('minute', 0).set('second', 0).millisecond(0).toISOString()

  //return await prisma.booking.findMany()
  const bookings = await prisma.booking.findMany({
    where: {
      dayBooking: {
        date: parsedDate
      }
    },
    select: {
      id: true,
      time: true,
      status: true,
      notes: true,
      dog: {
        select: {
          id: true,
          name: true,
          breed: true,
          Owner: {
            select: {
              id: true,
              name: true,
              phoneOne: true
            }
          }
        }
      },
      offering: {
        select: {
          ownerId: true,
          owner: true,
          phone: true,
          notes: true,
        }
      }
    },
    orderBy: {
      time: 'asc'
    }
  })

  const parsedDateStart = dayjs(date).subtract(1, 'month').toISOString()
  const parsedDateEnd = dayjs(date).add(2, 'month').toISOString()


  const calendar = await prisma.booking.findMany({
    distinct: 'day_booking_id',
    where: {
      time: {
        lte: parsedDateEnd,
        gte: parsedDateStart
      },
      status: 'empty'
    },
    select: {
      dayBooking: {
        select: {
          date: true,
          daysBooking: {
            where: {
              status: 'empty'
            },
            select: {
              dayBooking: true
            }
          }
        }
      }
    },
  })

  return { bookings: bookings, calendar: calendar }
}

async function addBookingSpaceHandle(request: FastifyRequest<{ Body: BookingInput }>, reply: FastifyReply) {
  try {
    return await addBookingSpace(request.body)
  } catch (err) {
    reply.code(400).send('Error in add dog attendance')
  }
}
async function addBookingSpace(input: BookingInput) {
  const { date, status } = input
  const parsedTime = dayjs(date).toISOString()
  const parsedDate = dayjs(date).set('hour', 0).set('minute', 0).set('second', 0).millisecond(0).toISOString()
  let booking = await prisma.booking.create({
    data: {
      time: parsedTime,
      status: status,
      dayBooking: {
        connectOrCreate: {
          where: {
            date: parsedDate,
          },
          create: {
            date: parsedDate,
          }
        }
      }
    }
  })

  return booking
}

async function addBookingFillSpaceHandle(request: FastifyRequest<{ Body: DateFillSpacesBodyInput }>, reply: FastifyReply) {
  try {
    return await addBookingFillSpaces(request.body)
  } catch (err) {
    reply.code(400).send('Error in add dog attendance')
  }
}

async function addBookingFillSpaces(input: DateFillSpacesBodyInput) {
  const { date } = input
  const parsedDate = dayjs(date).set('hour', 0).set('minute', 0).set('second', 0).millisecond(0).toISOString()

  let times = await prisma.preferences.findUnique({
    where: {
      key: "FullDayBooking"
    }
  })
  if (times == null) return new Error('Settings not found')
  let timesArray = times.value.replace('[', '').replace(']', '').replace(/'/g, '').split(',')
  let timesFormated = timesArray.map((time) => {
    let hourMinute = time.split(':')
    let newDate = new Date(parsedDate)
    newDate.setMilliseconds(0)
    let newTime = dayjs(parsedDate).set('hour', Number(hourMinute[0])).set('minute', Number(hourMinute[1])).millisecond(0).toISOString()

    return { time: newTime, status: 'empty' }
  })

  var bookingDay = await prisma.dayBooking.findUnique({
    where: {
      date: parsedDate
    }
  })

  if (bookingDay == null) {
    bookingDay = await prisma.dayBooking.create({
      data: {
        date: parsedDate
      }
    })
  }

  let listBooking = await prisma.dayBooking.update({
    select: {
      date: true,
      notes: true,
      daysBooking: true
    },
    where: {
      date: parsedDate
    },
    data: {
      daysBooking: {
        create: timesFormated
      }
    }
  })

  return listBooking
}

async function bookingRow(time: { time: string, status: string }, date: string) {
  let booking = await prisma.booking.create({
    data: {
      time: time.time,
      status: time.status,
      dayBooking: {
        connectOrCreate: {
          where: {
            date,
          },
          create: {
            date,
          }
        }
      }
    }
  })
  return booking
}


async function deleteBookingHandler(request: FastifyRequest<{ Querystring: { id: number } }>, reply: FastifyReply) {
  try {
    return await deleteBooking(request.query.id)
  } catch (err) {
    console.log(err)
    reply.code(400).send('Error in delete user')
  }
}

async function deleteBooking(id: number) {

  const booking = await prisma.booking.findUnique({
    where: { id: Number(id) },
    include: {
      offering: true
    }
  })

  if (booking?.offering != null) {
    await prisma.offering.delete({ where: { id: booking.offering.id } })
  }

  const deleted = await prisma.booking.delete({ where: { id: Number(id) } })
  return deleted
}

async function cancelBookingHandler(request: FastifyRequest<{ Querystring: { id: number } }>, reply: FastifyReply) {
  try {
    return await cancelBooking(request.query.id)
  } catch (err) {
    console.log(err)
    reply.code(400).send('Error in cancel booking')
  }
}

async function cancelBooking(id: number) {

  const booking = await prisma.booking.update({
    where: { id: Number(id) },
    data: {
      status: 'cancelled'
    }
  })

  return booking
}


async function getSearchExistedHandle(request: FastifyRequest<{ Querystring: FilterSearchingInput }>, reply: FastifyReply) {
  try {
    return await getSearchByName(request.query.name)
  } catch (err) {
    console.log(err)
    reply.code(400).send('Error in search owner by name')
  }
}

async function getSearchByName(name: string) {
  const result = await prisma.dog.findMany({
    take: 10,
    where: {
      OR: [
        {
          Owner: {
            name: { contains: name, mode: 'insensitive' },
          }
        },
        { name: { contains: name, mode: 'insensitive' } },
        { breed: { contains: name, mode: 'insensitive' } },
        {
          Owner: {
            phoneOne: { contains: name, mode: 'insensitive' }
          }
        }
        //{ nickname: { contains: name } }
      ]
    },
    select: {
      id: true,
      name: true,
      ownerId: true,
      breed: true,
      Owner: {
        select: {
          id: true,
          name: true,
          phoneOne: true,
          dogs: true
        }
      }
    },
    orderBy: {
      id: "desc",
    },
  })
  return result
}


async function addBookingOfferingHandle(request: FastifyRequest<{ Body: BookingOfferingInput }>, reply: FastifyReply) {
  try {
    return await addBookingOffering(request.body)
  } catch (err) {
    console.log(err)
    reply.code(400).send('Error in add a booking offer')
  }
}

async function addBookingOffering(input: BookingOfferingInput) {
  const { ownerId, owner, phone, typeOffered, notes, firstDogTime, secondDogTime, thirdDogTime, fourthDogTime } = input

  var offers = []
  if (firstDogTime != null && firstDogTime != "")
    offers.push(await creatingOffering(firstDogTime, typeOffered, owner, phone, ownerId, notes, typeOffered))
  if (secondDogTime != null && secondDogTime != "")
    offers.push(await creatingOffering(secondDogTime, typeOffered, owner, phone, ownerId, notes, typeOffered))
  if (thirdDogTime != null && thirdDogTime != "")
    offers.push(await creatingOffering(thirdDogTime, typeOffered, owner, phone, ownerId, notes, typeOffered))
  if (fourthDogTime != null && fourthDogTime != "")
    offers.push(await creatingOffering(fourthDogTime, typeOffered, owner, phone, ownerId, notes, typeOffered))
  return offers
}

async function creatingOffering(time: string, status: string, owner: string | null, phone: string | null, ownerId: string | null, notes: string, type: string) {

  let offering = await prisma.booking.update({
    where: {
      id: Number(time)
    },
    data: {
      status,
      offering: {
        upsert: {
          create: {
            owner,
            phone,
            ownerId: Number(ownerId),
            notes,
            type
          },
          update: {
            owner,
            phone,
            ownerId: Number(ownerId),
            notes,
            type
          }
        }
      }
    },
  })
  return offering
}

async function addBookingConfirmedOfferHandle(request: FastifyRequest<{ Body: BookingConfirmedOfferInput }>, reply: FastifyReply) {
  try {
    return await addBookingConfirmedOffer(request.body)
  } catch (err) {
    console.log(err)
    reply.code(400).send('Error in confirming offer')
  }
}

async function addBookingConfirmedOffer(input: BookingConfirmedOfferInput) {
  const { bookingId, dogId, owner, phone, notes, firstDogTime, firstDogName, firstDogBreed } = input

  const bookingOffer = await prisma.booking.findUnique({ where: { id: bookingId }, include: { offering: true } })

  const dog = await prisma.dog.findUnique({ where: { id: dogId == null || dogId == "" ? 0 : Number(dogId) }, include: { Owner: true } })

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      notes: notes,
      status: 'confirmed',
      dog: {
        connectOrCreate: {
          where: {
            id: dog == null ? 0 : dog.id,
          },
          create: {
            name: firstDogName,
            breed: firstDogBreed,
            Owner: {
              connectOrCreate: {
                where: {
                  id: dog == null ? 0 : dog.Owner.id,
                },
                create: {
                  name: owner,
                  phoneOne: phone,
                  type: 'G'
                }
              }
            }
          }
        }
      }
    },
    include: {
      dog: {
        include:
        {
          Owner: true,
        }
      }
    }
  })

  await prisma.offering.update({
    where: { id: bookingOffer?.offering?.id },
    data: {
      ownerId: booking.dog?.Owner.id
    }
  })

  return booking
}

async function addBookingNewCustomerHandle(request: FastifyRequest<{ Body: BookingCreateNewCustomer }>, reply: FastifyReply) {
  try {
    return await addBookingNewCustomer(request.body)
  } catch (err) {
    console.log(err)
    reply.code(400).send('Error in creating new booking and owner')
  }
}

async function addBookingNewCustomer(input: BookingCreateNewCustomer) {
  const { owner, phone, notes, firstDogTime, firstDogName, firstDogBreed, secondDogTime, secondDogName, secondDogBreed, thirdDogTime, thirdDogName, thirdDogBreed, fourthDogTime, fourthDogName, fourthDogBreed } = input
  var listBooking = []
  const firstDog: any = await addBookingNewCustomerUpdate(0, owner, phone, notes, firstDogTime, firstDogName, firstDogBreed)
  listBooking.push(firstDog)
  if (secondDogTime != null && secondDogTime != "")
    listBooking.push(await addBookingNewCustomerUpdate(firstDog.dog?.Owner.id, owner, phone, notes, secondDogTime, String(secondDogName), String(secondDogBreed)))
  if (thirdDogTime != null && thirdDogTime != "")
    listBooking.push(await addBookingNewCustomerUpdate(firstDog.dog?.Owner.id, owner, phone, notes, thirdDogTime, String(thirdDogName), String(thirdDogBreed)))
  if (fourthDogTime != null && fourthDogTime != "")
    listBooking.push(await addBookingNewCustomerUpdate(firstDog.dog?.Owner.id, owner, phone, notes, fourthDogTime, String(fourthDogName), String(fourthDogBreed)))

  return listBooking
}

async function addBookingNewCustomerUpdate(ownerId: number, owner: string, phone: string, notes: string | null, dogTime: string, dogName: string, dogBreed: string) {

  const booking = await prisma.booking.update({
    where: { id: Number(dogTime) },
    data: {
      notes: notes,
      status: 'confirmed',
      dog: {
        create: {
          name: dogName,
          breed: dogBreed,
          Owner: {
            connectOrCreate: {
              where: {
                id: ownerId
              },
              create: {
                name: owner,
                phoneOne: phone,
                type: 'G'
              }
            }
          }
        }
      }
    },
    include: {
      dog: {
        include: {
          Owner: true
        }
      }
    }
  })

  return booking
}

async function addBookingExistedCustomerHandle(request: FastifyRequest<{ Body: BookingCreateExistedCustomer }>, reply: FastifyReply) {
  try {
    return await addBookingExistedCustomer(request.body)
  } catch (err) {
    console.log(err)
    reply.code(400).send('Error in creating new booking with existed owner')
  }
}

async function addBookingExistedCustomer(input: BookingCreateExistedCustomer) {
  const { notes, firstDogTime, firstDogId, secondDogTime, secondDogId, thirdDogTime, thirdDogId, fourthDogTime, fourthDogId } = input

  var listBooking = []
  listBooking.push(await addBookingExitedCustomerUpdate(firstDogId, firstDogTime, notes))
  if (secondDogId != null && secondDogId != 0)
    listBooking.push(await addBookingExitedCustomerUpdate(secondDogId, Number(secondDogTime), notes))
  if (thirdDogId != null && thirdDogId != 0)
    listBooking.push(await addBookingExitedCustomerUpdate(thirdDogId, Number(thirdDogTime), notes))
  if (fourthDogId != null && fourthDogId != 0)
    listBooking.push(await addBookingExitedCustomerUpdate(fourthDogId, Number(fourthDogTime), notes))

  return listBooking
}

async function addBookingExitedCustomerUpdate(dogId: number, timeId: number, notes: string | null) {

  const booking = await prisma.booking.update({
    where: { id: timeId },
    data: {
      notes: notes,
      status: 'confirmed',
      dog: {
        connect: {
          id: dogId,
        },
      },
    },
    include: {
      dog: {
        include: {
          Owner: true
        }
      }
    }
  })

  return booking
}


async function addBookingFinishCustomerHandle(request: FastifyRequest<{ Body: BookingFinishInput }>, reply: FastifyReply) {
  try {
    return await addBookingFinishCustomer(request.body)
  } catch (err:any) {
    console.log(err)
    reply.code(400).send('Error in finishing booking - ' + err.message)
  }
}

async function addBookingFinishCustomer(input: BookingFinishInput) {
  const { bookingId, notes, description, salesValue, paidValue, typePaid, paid } = input

  const bookingOwner = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      dog: {
        include: {
          Owner: true
        }
      }
    }
  })

  if (bookingOwner == null) {
    throw new Error('Owner not found in booking')
  }
  var date = dayjs().toISOString()

  if (paid && Number(paidValue) < Number(salesValue)) {
    return new Error('Paid value needs to be bigger than the sales value')
  }
  var valuePaid = paid ? paidValue : 0
  var totalValue = salesValue - valuePaid
  const booking = await prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      status: 'done',
      notes: notes,
      extract: {
        create: {
          value: salesValue,
          paidValue: valuePaid,
          totalValue: totalValue < 0 ? 0 : totalValue,
          done: paid,
          type: typePaid,
          description: description,
          date: date,
          Owner: {
            connect: {
              id: bookingOwner.dog?.Owner.id
            }
          }
        }
      }
    }
  })

  if (paid) {
    await updateTillHandle('G', typePaid, salesValue, valuePaid)
  }

  return booking
}



async function addBookingEditOwnerHandle(request: FastifyRequest<{ Body: BookingEditInput }>, reply: FastifyReply) {
  try {
    return await addBookingEditOwner(request.body)
  } catch (err) {
    console.log(err)
    reply.code(400).send('Error in editing booking')
  }
}

async function addBookingEditOwner(input: BookingEditInput) {
  const { dogId, notes, owner, phone, dogName, dogBreed, second, secondOwner, secondPhone } = input

  let ownerResult = null
  if (second) {
    ownerResult = await prisma.dog.update({
      where: {
        id: dogId
      },
      data: {
        name: dogName,
        breed: dogBreed,
        Owner: {
          update: {
            name: owner,
            phoneOne: phone,
            secondOwner: secondOwner,
            phoneTwo: secondPhone,
            notes: notes
          }
        }
      }
    })
  } else {
    ownerResult = await prisma.dog.update({
      where: {
        id: dogId
      },
      data: {
        name: dogName,
        breed: dogBreed,
        Owner: {
          update: {
            name: owner,
            phoneOne: phone,
            notes: notes
          }
        }
      }
    })
  }
  return ownerResult
}



