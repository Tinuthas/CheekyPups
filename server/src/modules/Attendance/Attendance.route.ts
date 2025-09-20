import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { $ref, AttendanceFilterInput, AttendanceInput, AttendanceUpdateInput, AttendanceUpdatePayInput, DogsAttendanceResult } from "./Attendance.schema";

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

  app.get('/id', {
    schema: {
      querystring: $ref('updateAttendanceId'),
    },
    preHandler: [app.authenticate]
  }, getUniqueAttendanceHandle)

  app.put('/', {
    schema: {
      body: $ref('updateAttendanceBody'),
      querystring: $ref('updateAttendanceId'),
    },
    preHandler: [app.authenticate]
  }, updateAttendanceHandle)

  app.put('/pay', {
    schema: {
      body: $ref('updateAttendancePay'),
      querystring: $ref('updateAttendanceId'),
    },
    preHandler: [app.authenticate]
  }, updateAttendancePayHandle)

  app.delete('/', {
    schema: {
      params: {
        id: { type: 'number' }, // converts the id param to number
      },
    }
  }, deleteAttendanceHandle)   

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
    const {dog_id, date, typeDay, paid, value, descriptionValue} = input

    //const parsedDate = dayjs(date).startOf('day')

    

    let dog = await prisma.dog.findUnique({
      where: {
        id: Number(dog_id)
      },
      select: {
        ownerId: true
      }
    })


    var dateParts:any[] = date.split('/')
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
    var parsedDate = dayjs(dateObject).startOf('day').toISOString()
    console.log(parsedDate)

    let checkedAttendance = await prisma.attendance.findFirst({
      where: {
       dog: {
        id: Number(dog_id)
       },
       day: {
        date: parsedDate,
       }
      }
    })

    if(checkedAttendance != undefined && checkedAttendance.id != null) {
      return checkedAttendance
    }

    let attendance = await prisma.attendance.create(
      {
        data: {
          typeDay,
          paid,
          day: {
            connectOrCreate: {
              where: {
                date: parsedDate,
              },
              create: {
                date: parsedDate,
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
                  id: dog?.ownerId
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

    if(paid == true) {
      let updAtt = await prisma.attendance.update({
        where: {
          id: attendance.id
        },
        data: {
          extract: {
            create: {
              value: -value,
              description: descriptionValue,
              date: dayjs().toISOString(),
              Owner: {
                connect: {
                  id: dog?.ownerId
                }
              }
            }
          }
        }
      })
    }



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
      typeDay: true,
      paid: true,
      dog: {
        select: {
          id: true,
          name: true,
          nickname: true,
          avatarUrl: true,
          Owner: {
            select: {
              id: true,
              name: true,
              _count: {
                select: {
                  dogs: true
                }
              }
            }
          }
        },
      },
      day: {
        select: {
          date: true,
        },
      }
    },
    orderBy: [
      {
        dog: {
          Owner: {
            name: 'desc'
          }
        },
      },
      {
        day: {
          date: 'asc'
        }
      }
    ]
  })

  let dogsAttendance = new Map<string, { id: number, attendanceIds:[id: number], dog_id:number, owner_id:number, owner_name:string, owner_dogs:number, name: string, nickname: string | null, avatarUrl: string | null, dates:[date:string], typeDays:[typeDay:string], paids:[paid:boolean] }>();
  for (let index = 0; index < attendances.length; index++) {
    const element = attendances[index];
    if (dogsAttendance.has(element.dog.id.toString())) {
      dogsAttendance.get(element.dog.id.toString())?.attendanceIds.push(element.id)
      dogsAttendance.get(element.dog.id.toString())?.dates.push(dayjs(element.day.date).format('DD/MM/YYYY'))
      dogsAttendance.get(element.dog.id.toString())?.typeDays.push(element.typeDay)
      dogsAttendance.get(element.dog.id.toString())?.paids.push(element.paid)
    }else{
      dogsAttendance.set(element.dog.id.toString(), {
        id: element.dog.id,
        attendanceIds: [element.id],
        dog_id: element.dog.id,
        owner_id: element.dog.Owner.id,
        owner_name: element.dog.Owner.name,
        owner_dogs: element.dog.Owner._count.dogs,
        name: `${element.dog.name} ${element.dog.nickname != null ?'- '+ element.dog.nickname : ''}`.trim(),
        nickname: element.dog.nickname,
        avatarUrl: element.dog.avatarUrl,
        dates: [dayjs(element.day.date).format('DD/MM/YYYY')],
        typeDays: [element.typeDay],
        paids: [element.paid]
      })
    }
  }

  const convertList: { id: number, attendanceIds: [id: number]; dog_id: number; name: string; nickname: string | null; avatarUrl: string | null; dates: [date: string]; typeDays:[typeDay:string]; }[] = [];
  dogsAttendance.forEach((value, key) => convertList.push(value));

  return convertList
}

async function getUniqueAttendanceHandle(request: FastifyRequest<{Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    return await getUniqueAttendance(request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in get unique attendance')
  }
}

async function getUniqueAttendance(id: number) {
  let attendance = prisma.attendance.findUnique({
    where: {
      id: Number(id)
    },
    select: {
      id: true,
      paid: true,
      typeDay: true,
      extract: {
        select: {
          value: true,
          description: true
        }
      },
      day: {
        select: {
          date: true
        }
      }
    }
  })
  return attendance
}


async function deleteAttendanceHandle(request: FastifyRequest<{Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    return await deleteAttendance(request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in delete attendance')
  }
}

async function deleteAttendance(id: number) {

  let att = await prisma.attendance.findUnique({
    where: {
      id: Number(id)
    }
  })
  if(att?.paid != true) {
    const deleteAttendance = await prisma.attendance.delete({
      where: {
        id: Number(id)
      },
      select: {
        extract:{
          select: {
            id: true,
          }
        },
      }
    })
    /*if(deleteAttendance.extract != null) {
      const deleteExtract = await prisma.extract.delete({
        where: {
          id: Number(deleteAttendance.extract.id)
        }
      })
    }*/
    return deleteAttendance
  }else {
    return new Error('Attendance cannot be deleted because it was already paid')
  }
}

async function updateAttendanceHandle(request: FastifyRequest<{Body: AttendanceUpdateInput, Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    return await updateAttendance(request.body, request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in update attendance')
  }
}


async function updateAttendance(input: AttendanceUpdateInput, id: number) {
  const {typeDay, paid, value, descriptionValue} = input

  let att = await prisma.attendance.findUnique({
    where: {
      id: Number(id)
    }, 
    select: {
      paid:true,
      dog: {
        select: {
          ownerId: true,
        },
      }
    }
  })

  if(att?.paid != paid) {
    let attendanceUpt = await prisma.attendance.update({
      where: {
        id: Number(id)
      },
      data: {
        typeDay, 
        paid, 
        extract : {
          update: {
            value,
            description: descriptionValue,
            date: dayjs().toISOString(),
          }
        }
      }
    })  
    return attendanceUpt
  } else {
    let attendanceUpt = await prisma.attendance.update({
      where: {
        id: Number(id)
      },
      data: {
        typeDay, 
        paid, 
        extract : {
          create: {
            value,
            description: descriptionValue,
            date: dayjs().toISOString(),
            Owner: {
              connect: {
                id: att?.dog?.ownerId
              }
            }
          }
        }
      }
    })
    return attendanceUpt
  }

  
  return att
}

async function updateAttendancePayHandle(request: FastifyRequest<{Body: AttendanceUpdatePayInput, Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    return await updatePayAttendance(request.body, request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in update attendance payment')
  }
}

async function updatePayAttendance(input: AttendanceUpdatePayInput, id: number) {

  const {descriptionValue} = input

  let att = await prisma.attendance.findUnique({
    where: {
      id: Number(id)
    }, 
    select: {
      paid: true,
      extract: {
        select: {
          id: true,
          value: true,
        }
      },
      dog: {
        select: {
          ownerId: true,
        },
      }
    }
  })
  //if(att?.paid != true) {
    let updAtt = await prisma.attendance.update({
      where: {
        id: Number(id)
      },
      data: {
        paid: !att?.paid,
        extract: {
          create: {
            value: - att!.extract!.value,
            description: descriptionValue,
            date: dayjs().toISOString(),
            Owner: {
              connect: {
                id: att?.dog?.ownerId
              }
            }
          }
        }
      }
    })
  /*}else {
    let updAtt = await prisma.attendance.update({
      where: {
        id: Number(id)
      },
      data: {
        paid: !att?.paid,
      }
    })*/

    /*let extract = await prisma.extract.delete({
      where: {
        id: att.extract?.id
      }
    })*/
  //}
}