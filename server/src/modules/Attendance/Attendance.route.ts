import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { $ref, AttendanceFilterInput, AttendanceInput, DogsAttendanceResult } from "./Attendance.schema";

export async function attendanceRoutes(app: FastifyInstance) {

  app.post('/', {
    schema: {
      body: $ref('createAttendanceBody'),
    },
    preHandler: [app.authenticate]
  }, addAttendanceHandle)

  app.get('/', {
    schema: {
     querystring: $ref('filterAttendance')
    },
    preHandler: [app.authenticate]
  }, getAttendancesByDate)

  async function addAttendanceHandle(request: FastifyRequest<{Body: AttendanceInput}>, reply: FastifyReply) {
    try{
      return await addAttendance(request.body)
    }catch(err) {
      reply.code(400).send('Error in add dog attendance')
    }
  }

  async function getAttendancesByDate(request: FastifyRequest<{Querystring: AttendanceFilterInput}>, reply: FastifyReply) {
    try{
      return await getAttendances(request.query)
    }catch(err) {
      reply.code(400).send('Error in get attendances by filter')
    }
  }

  async function addAttendance(input: AttendanceInput){
    const {owner_id, dog_id, date, fullDay, value, descriptionValue} = input

    const parsedDate = dayjs(date).startOf('day')

    let attendance = await prisma.attendance.create(
      {
        data: {
          fullDay,
          day: {
            connectOrCreate: {
              where: {
                date: parsedDate.toISOString(),
              },
              create: {
                date: parsedDate.toISOString(),
              }
            }
          },
          dog: {
            connect: {
              id: dog_id
            }
          },
          extract : {
            create: {
              value,
              description: descriptionValue,
              date: dayjs().toISOString(),
              Owner: {
                connect: {
                  id: owner_id
                }
              }
              
            }
          }
          
        },
        include: {
          day: true,
          dog: true,
          extract: true
        }
      }
    )

    return attendance
  }

}


async function getAttendances(input: AttendanceFilterInput){
  var {dateStart, dateEnd} = input
  const parsedDateStart = dayjs(dateStart).startOf('day').toISOString()
  const parsedDateEnd = dayjs(dateEnd).startOf('day').toISOString()

  const attendances = await prisma.attendance.findMany({
    where: {
      day: {
        date: {
          lte: parsedDateEnd,
          gte: parsedDateStart
        }
      }
    },
    select: {
      id: true,
      fullDay: true,
      dog: {
        select: {
          id: true,
          name: true
        }
      },
      day: {
        select: {
          date: true
        }
      }
    },
    orderBy: [
      {
        dog: {
          name: 'asc'
        },
      },
      {
        day: {
          date: 'asc'
        }
      }
    ]
  })

 
  let dogsAttendance = new Map<string, { id: string, attendanceIds:[id: string], dog_id:string, name: string, dates:[date:Date], fullDates:[fullDate:boolean] }>();
  console.log('teste')
  for (let index = 0; index < attendances.length; index++) {
    const element = attendances[index];
    console.log(element.dog.id)
    if (dogsAttendance.has(element.dog.id)) {
      dogsAttendance.get(element.dog.id)?.attendanceIds.push(element.id)
      dogsAttendance.get(element.dog.id)?.dates.push(element.day.date)
      dogsAttendance.get(element.dog.id)?.fullDates.push(element.fullDay)
    }else{
      console.log(dayjs(element.day.date).format('DD/MM/YYYY'))
      dogsAttendance.set(element.dog.id, {
        id: element.dog.id,
        attendanceIds: [element.id],
        dog_id: element.dog.id,
        name: element.dog.name,
        dates: [element.day.date],
        fullDates: [element.fullDay]
      })
    }
  }

  console.log(dogsAttendance.size)
  const convertList: { id: string, attendanceIds: [id: string]; dog_id: string; name: string; dates: [date: Date]; fullDates: [fullDate: boolean]; }[] = [];
  dogsAttendance.forEach((value, key) => convertList.push(value));


  return convertList
}