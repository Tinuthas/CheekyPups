import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { $ref, BookingInput, FilterBookingDateInput, DateFillSpacesBodyInput, FilterSearchingInput } from "./Booking.schema";


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
}

async function getBookingByDate(request: FastifyRequest<{ Querystring: FilterBookingDateInput }>, reply: FastifyReply) {
  try {
    return await getBookingsDate(request.query)
  } catch (err) {
    reply.code(400).send('Error in get attendances by filter')
  }
}

async function getBookingsDate(input: FilterBookingDateInput) {
  const { date } = input
  const parsedDate = dayjs(date).set('hour', 0).set('minute', 0).set('second', 0).millisecond(0).toISOString()

  //return await prisma.booking.findMany()
  console.log(parsedDate)
  const bookings = await prisma.booking.findMany({
    where: {
      dayBooking: {
        date: parsedDate
      }
    },
    orderBy: {
      time: 'asc'
    }
  })

  return bookings
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

  if(bookingDay == null) {
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

async function bookingRow(time: {time : string, status: string}, date: string) {
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

  const deleted = await prisma.booking.delete({
    where: {
      id: Number(id)
    },
  })
  return deleted
}

async function getSearchExistedHandle(request: FastifyRequest<{Querystring: FilterSearchingInput}>, reply: FastifyReply) {
  try{
    return await getSearchByName(request.query.name)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in search owner by name')
  }
}

async function getSearchByName(name: string) {
  const result = await prisma.dog.findMany({
    take: 10,
    where: {
      OR: [
        { Owner: {
          name: { contains: name},
        }},
        { name: { contains: name} },
        { breed: { contains: name} },
        { Owner: {
          phoneOne: {contains: name}
        }}
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

