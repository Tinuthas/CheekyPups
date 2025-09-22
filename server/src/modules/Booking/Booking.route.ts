import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { $ref, BookingInput, FilterBookingDateInput, } from "./Booking.schema";


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
}

async function getBookingByDate(request: FastifyRequest<{Querystring: FilterBookingDateInput}>, reply: FastifyReply) {
    try{
      return await getBookingsDate(request.query)
    }catch(err) {
      reply.code(400).send('Error in get attendances by filter')
    }
}

async function getBookingsDate(input: FilterBookingDateInput) {
  const {date} = input
  const parsedDate = dayjs(date).startOf('day').toISOString()

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

async function addBookingSpaceHandle(request: FastifyRequest<{Body: BookingInput}>, reply: FastifyReply) {
  try{
    return await addBookingSpace(request.body)
  }catch(err) {
    reply.code(400).send('Error in add dog attendance')
  }
}
async function addBookingSpace(input: BookingInput) {
  const {date, status} = input
  const parsedTime = dayjs(date).toISOString()
  const parsedDate = dayjs(date).startOf('day').toISOString()
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

