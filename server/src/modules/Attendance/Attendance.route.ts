import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { $ref, AttendanceInput } from "./Attendance.schema";

export async function attendanceRoutes(app: FastifyInstance) {

  app.post('/', {
    schema: {
      body: $ref('createAttendanceBody'),
    },
    preHandler: [app.authenticate]
  }, addAttendanceHandle)

  async function addAttendanceHandle(request: FastifyRequest<{Body: AttendanceInput}>, reply: FastifyReply) {
    try{
      return await addAttendance(request.body)
    }catch(err) {
      reply.code(400).send('Error in add dog attendance')
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