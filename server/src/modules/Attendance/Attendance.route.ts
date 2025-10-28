import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { $ref, AttendanceFilterInput, AttendanceInput, AttendanceUpdateInput, AttendanceUpdatePayInput, AttendanceWeekInput, DogsAttendanceResult } from "./Attendance.schema";
import { updateTillHandle } from "../Payment/Payment.route";

export async function attendanceRoutes(app: FastifyInstance) {

  app.post('/', {
    schema: {
      body: $ref('createAttendanceBody'),
    },
    preHandler: [app.authenticate]
  }, addAttendanceHandle)

  app.post('/week', {
    schema: {
      body: $ref('createAttendanceWeekBody'),
    },
    preHandler: [app.authenticate]
  }, addAttendanceWeekHandle)

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

  app.get('/summary', {
    schema: {
      querystring: $ref('filterAttendance')
    },
    preHandler: [app.authenticate]
  }, getSummaryDaycare)

  async function addAttendanceHandle(request: FastifyRequest<{ Body: AttendanceInput }>, reply: FastifyReply) {
    try {
      return await addAttendance(request.body)
    } catch (err: any) {
      reply.code(400).send('Error in adding dog daycare - ' + String(err.message))
    }
  }

  async function getAttendancesByDate(request: FastifyRequest<{ Querystring: AttendanceFilterInput }>, reply: FastifyReply) {
    try {
      return await getAttendances(request.query)
    } catch (err) {
      reply.code(400).send('Error in get attendances by filter')
    }
  }

  async function addAttendance(input: AttendanceInput) {
    const { date, paid, typePaid, paidValue, descriptionValue, firstDogId, firstDogValue, firstDogTypeDay, secondDogId, secondDogValue, secondDogTypeDay, thirdDogId, thirdDogValue, thirdDogTypeDay, fourthDogId, fourthDogValue, fourthDogTypeDay } = input
    //const parsedDate = dayjs(date).startOf('day')
    var dateParts: any[] = date.split('/')
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
    var parsedDate = dayjs(dateObject).startOf('day').toISOString()


    var restPaidValue = null
    var booleanPaid = paid
    if (paidValue != null && Number(paidValue) >= 0) {
      restPaidValue = Number(paidValue)
      booleanPaid = paid

      var totalPaid = (firstDogId != 0 ? Number(firstDogValue) : 0 + Number(secondDogId) != 0 ? Number(secondDogValue) : 0 + Number(thirdDogId) != 0 ? Number(thirdDogValue) : 0 + Number(fourthDogId) != 0 ? Number(fourthDogValue) : 0)
      await updateTillHandle('D', String(typePaid), totalPaid, Number(paidValue))
    }

    var listAtt: any[] = []
    var [att1, paidValue1, paidAtt1]: any = await checkPaidAttendance(parsedDate, firstDogId, firstDogTypeDay, booleanPaid, restPaidValue, String(typePaid), firstDogValue, descriptionValue)
    restPaidValue = paidValue1
    booleanPaid = paidAtt1
    att1 != null ? listAtt.push(att1) : null
    var [att2, paidValue2, paidAtt2]: any = await checkPaidAttendance(parsedDate, Number(secondDogId), String(secondDogTypeDay), booleanPaid, restPaidValue, String(typePaid), Number(secondDogValue), descriptionValue)
    restPaidValue = paidValue2
    booleanPaid = paidAtt2
    att2 != null ? listAtt.push(att2) : null
    var [att3, paidValue3, paidAtt3]: any = await checkPaidAttendance(parsedDate, Number(thirdDogId), String(thirdDogTypeDay), booleanPaid, restPaidValue, String(typePaid), Number(thirdDogValue), descriptionValue)
    restPaidValue = paidValue3
    booleanPaid = paidAtt3
    att3 != null ? listAtt.push(att3) : null
    var [att4, paidValue4, paidAtt4]: any = await checkPaidAttendance(parsedDate, Number(fourthDogId), String(fourthDogTypeDay), booleanPaid, restPaidValue, String(typePaid), Number(fourthDogValue), descriptionValue)
    restPaidValue = paidValue4
    booleanPaid = paidAtt4
    att4 != null ? listAtt.push(att4) : null

    return listAtt
  }

  async function addingAttendanceDog(date: string, dogId: number, typeDay: string, paid: boolean, paidValue: number | null, typePaid: string, value: number, descriptionValue: string) {

    let dog = await prisma.dog.findUnique({
      where: {
        id: Number(dogId)
      },
      select: {
        ownerId: true
      }
    })

    let checkedAttendance = await prisma.attendance.findFirst({
      where: {
        dog: {
          id: Number(dogId)
        },
        day: {
          date: date,
        }
      }
    })

    if (checkedAttendance != undefined && checkedAttendance.id != null) {
      throw new Error('Dog already in the day')
    }

    let totalValue = paid ? (Number(value) - Number(paidValue)) : value
    let paidVal = paid ? (Number(paidValue) > value ? value : (paidValue)) : 0
    let typePad = paid ? typePaid : null

    let attendance = await prisma.attendance.create(
      {
        data: {
          typeDay,
          paid,
          day: {
            connectOrCreate: {
              where: {
                date: date,
              },
              create: {
                date: date,
              }
            }
          },
          dog: {
            connect: {
              id: dogId
            }
          },
          extract: {
            create: {
              value,
              description: descriptionValue,
              date: dayjs().toISOString(),
              type: typePad,
              done: paid,
              paidValue: paidVal,
              totalValue: totalValue,
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
    return attendance

  }



  async function getAttendances(input: AttendanceFilterInput) {
    var { dateStart, dateEnd } = input
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

    let dogsAttendance = new Map<string, { id: number, attendanceIds: [id: number], dog_id: number, owner_id: number, owner_name: string, owner_dogs: number, name: string, nickname: string | null, avatarUrl: string | null, dates: [date: string], typeDays: [typeDay: string], paids: [paid: boolean] }>();
    for (let index = 0; index < attendances.length; index++) {
      const element = attendances[index];
      if (dogsAttendance.has(element.dog.id.toString())) {
        dogsAttendance.get(element.dog.id.toString())?.attendanceIds.push(element.id)
        dogsAttendance.get(element.dog.id.toString())?.dates.push(dayjs(element.day.date).format('DD/MM/YYYY'))
        dogsAttendance.get(element.dog.id.toString())?.typeDays.push(element.typeDay)
        dogsAttendance.get(element.dog.id.toString())?.paids.push(element.paid)
      } else {
        dogsAttendance.set(element.dog.id.toString(), {
          id: element.dog.id,
          attendanceIds: [element.id],
          dog_id: element.dog.id,
          owner_id: element.dog.Owner.id,
          owner_name: element.dog.Owner.name,
          owner_dogs: element.dog.Owner._count.dogs,
          name: `${element.dog.name} ${element.dog.nickname != null ? '- ' + element.dog.nickname : ''}`.trim(),
          nickname: element.dog.nickname,
          avatarUrl: element.dog.avatarUrl,
          dates: [dayjs(element.day.date).format('DD/MM/YYYY')],
          typeDays: [element.typeDay],
          paids: [element.paid]
        })
      }
    }

    const convertList: { id: number, attendanceIds: [id: number]; dog_id: number; name: string; nickname: string | null; avatarUrl: string | null; dates: [date: string]; typeDays: [typeDay: string]; }[] = [];
    dogsAttendance.forEach((value, key) => convertList.push(value));

    return convertList
  }

  async function getUniqueAttendanceHandle(request: FastifyRequest<{ Querystring: { id: number } }>, reply: FastifyReply) {
    try {
      return await getUniqueAttendance(request.query.id)
    } catch (err) {
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
            description: true,
            paidValue: true,
            type: true
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


  async function deleteAttendanceHandle(request: FastifyRequest<{ Querystring: { id: number } }>, reply: FastifyReply) {
    try {
      return await deleteAttendance(request.query.id)
    } catch (err:any) {
      reply.code(400).send('Error in delete attendance: '+err.message)
    }
  }

  async function deleteAttendance(id: number) {

    let att = await prisma.attendance.findUnique({
      where: {
        id: Number(id)
      }
    })
    if (att?.paid != true) {
      const deleteAttendance = await prisma.attendance.delete({
        where: {
          id: Number(id)
        },
        select: {
          extract: {
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
    } else {
      return new Error('Attendance cannot be deleted because it was already paid')
    }
  }

  async function updateAttendanceHandle(request: FastifyRequest<{ Body: AttendanceUpdateInput, Querystring: { id: number } }>, reply: FastifyReply) {
    try {
      return await updateAttendance(request.body, request.query.id)
    } catch (err:any) {
      reply.code(400).send('Error in update attendance: '+err.message)
    }
  }


  async function updateAttendance(input: AttendanceUpdateInput, id: number) {
    const { typeDay, paid, value, paidValue, typePaid, descriptionValue } = input

    if (paid == true && Number(paidValue) < value) {
      return new Error('Paid value needs to be bigger than the sales value')
    }

    let totalValue = paid ? (Number(value) - Number(paidValue)) : value
    let paidVal = paid ? (Number(paidValue) > value ? value : (paidValue)) : 0
    let typePad = paid ? typePaid : null

    let attOld = await prisma.attendance.findFirst({
      where:{
        id: Number(id),
        extract: {
          done: true
        }
      },
      select: {
        extract: {
          select: {
            done: true,
            value: true,
            paidValue: true,
          }
        }
      }
    })

    let attendanceUpt = await prisma.attendance.update({
      where: {
        id: Number(id)
      },
      data: {
        typeDay,
        paid,
        extract: {
          update: {
            value,
            description: descriptionValue,
            paidValue: paidVal,
            totalValue,
            done: paid,
            type: typePad,
            date: dayjs().toISOString(),
          }
        }
      }
    })

    if (paid) {
      await updateTillHandle('D', String(typePaid).toUpperCase(), value, Number(paidValue))
    }else if(attOld != undefined &&  attOld != null && attOld.extract?.done) {
      await updateTillHandle('D', String(typePaid).toUpperCase(), (value-Number(attOld?.extract?.value)),  (Number(paidValue)-Number(attOld?.extract?.paidValue)))
    }
    return attendanceUpt
  }

  async function updateAttendancePayHandle(request: FastifyRequest<{ Body: AttendanceUpdatePayInput, Querystring: { id: number } }>, reply: FastifyReply) {
    try {
      return await updatePayAttendance(request.body, request.query.id)
    } catch (err:any) {
      reply.code(400).send('Error in update attendance payment: '+err.message)
    }
  }

  async function updatePayAttendance(input: AttendanceUpdatePayInput, id: number) {

    const { done, paidValue, typePaid, descriptionValue } = input

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

    if (Number(paidValue) < Number(att?.extract?.value)) {
      return new Error('Paid value needs to be bigger than the sales value')
    }

    let totalValue = done ? (Number(att?.extract?.value) - Number(paidValue)) : att?.extract?.value
    let paidVal = done ? (Number(paidValue) > Number(att?.extract?.value) ? Number(att?.extract?.value) : (paidValue)) : 0
    let typePad = done ? typePaid : null

    let attOld = await prisma.attendance.findFirst({
      where:{
        id: Number(id),
        extract: {
          done: true
        }
      },
      select: {
        extract: {
          select: {
            done: true,
            value: true,
            paidValue: true,
          }
        }
      }
    })

    let updAtt = await prisma.attendance.update({
      where: {
        id: Number(id)
      },
      data: {
        paid: done,
        extract: {
          update: {
            description: descriptionValue,
            date: dayjs().toISOString(),
            done,
            paidValue: paidVal,
            totalValue,
            type: typePad,
            Owner: {
              connect: {
                id: att?.dog?.ownerId
              }
            }
          }
        }
      }
    })

    if (done) {
      await updateTillHandle('D', String(typePaid).toUpperCase(), Number(att?.extract?.value), Number(paidValue))
    }else if(attOld != undefined &&  attOld != null && attOld.extract?.done) {
      await updateTillHandle('D', String(typePaid).toUpperCase(), (Number(att?.extract?.value)-Number(attOld?.extract?.value)),  (Number(paidValue)-Number(attOld?.extract?.paidValue)))
    }

    await updateTillHandle('D', String(typePaid), Number(att?.extract?.value), Number(paidValue))

    return updAtt;
  }

  async function addAttendanceWeekHandle(request: FastifyRequest<{ Body: AttendanceWeekInput }>, reply: FastifyReply) {
    try {
      return await addAttendanceWeek(request.body)
    } catch (err:any) {
      reply.code(400).send('Error in adding dog daycare: ' + String(err.message))
    }
  }

  function parseDate(date: string) {
    var dateParts: any[] = date.split('/')
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
    var parsedDate = dayjs(dateObject).startOf('day').toISOString()
    return parsedDate
  }

  async function addAttendanceWeek(input: AttendanceWeekInput) {
    const { dogId, paid, typePaid, paidValue, firstDayDate, firstDayDescription, firstDayTypeDay, firstDayValue, secondDayDate, secondDayDescription, secondDayTypeDay, secondDayValue, thirdDayDate, thirdDayDescription, thirdDayTypeDay, thirdDayValue, fourthDayDate, fourthDayDescription, fourthDayTypeDay, fourthDayValue, fifthDayDate, fifthDayDescription, fifthDayTypeDay, fifthDayValue } = input

    var restPaidValue = null
    var booleanPaid = paid

    if (paidValue != null && Number(paidValue) >= 0) {
      restPaidValue = Number(paidValue)
      booleanPaid = paid

      var totalPaid = (Number(firstDayValue) + Number(secondDayValue) + Number(thirdDayValue) + Number(fourthDayValue) + Number(fifthDayValue))
      await updateTillHandle('D', String(typePaid), totalPaid, Number(paidValue))

    }

    var listAtt: any[] = []
    var [att1, paidValue1, paidAtt1]: any = await checkPaidAttendance(parseDate(String(firstDayDate)), dogId, String(firstDayTypeDay), booleanPaid, restPaidValue, String(typePaid), Number(firstDayValue), String(firstDayDescription))
    restPaidValue = paidValue1
    booleanPaid = paidAtt1
    att1 != null ? listAtt.push(att1) : null
    var [att2, paidValue2, paidAtt2]: any = await checkPaidAttendance(parseDate(String(secondDayDate)), dogId, String(secondDayTypeDay), booleanPaid, restPaidValue, String(typePaid), Number(secondDayValue), String(secondDayDescription))
    restPaidValue = paidValue2
    booleanPaid = paidAtt2
    att2 != null ? listAtt.push(att2) : null
    var [att3, paidValue3, paidAtt3]: any = await checkPaidAttendance(parseDate(String(thirdDayDate)), dogId, String(thirdDayTypeDay), booleanPaid, restPaidValue, String(typePaid), Number(thirdDayValue), String(thirdDayDescription))
    restPaidValue = paidValue3
    booleanPaid = paidAtt3
    att3 != null ? listAtt.push(att3) : null
    var [att4, paidValue4, paidAtt4]: any = await checkPaidAttendance(parseDate(String(fourthDayDate)), dogId, String(fourthDayTypeDay), booleanPaid, restPaidValue, String(typePaid), Number(fourthDayValue), String(fourthDayDescription))
    restPaidValue = paidValue4
    booleanPaid = paidAtt4
    att4 != null ? listAtt.push(att4) : null
    var [att5, paidValue5, paidAtt5]: any = await checkPaidAttendance(parseDate(String(fifthDayDate)), dogId, String(fifthDayTypeDay), booleanPaid, restPaidValue, String(typePaid), Number(fifthDayValue), String(fifthDayDescription))
    restPaidValue = paidValue5
    booleanPaid = paidAtt5
    att5 != null ? listAtt.push(att5) : null

    return listAtt
  }

  async function checkPaidAttendance(date: string, dogId: number, typeDay: string, paid: boolean, paidValue: number | null, typePaid: string, value: number, descriptionValue: string) {

    var att = null
    if (value != null && value >= 0 && dogId != 0)
      att = await addingAttendanceDog(date, dogId, typeDay, paid, paidValue, String(typePaid), value, descriptionValue)

    if (paidValue != null && value != null) {
      paidValue = (paidValue - value)
      if (paidValue <= 0) {
        paidValue = null
        paid = false
      }
    }

    return [att, paidValue, paid]
  }


  async function getSummaryDaycare(request: FastifyRequest<{ Querystring: AttendanceFilterInput }>, reply: FastifyReply) {
    try {
      return await getSummaryDateDaycare(request.query)
    } catch (err) {
      reply.code(400).send('Error in getting summary')
    }
  }

  async function getSummaryDateDaycare(input: AttendanceFilterInput) {

    const {dateStart, dateEnd} = input
    const parsedDateStart = dayjs(dateStart).startOf('day').toISOString()
    const parsedDateEnd = dayjs(dateEnd).startOf('day').toISOString()

   
        

    const daycare = await prisma.extract.groupBy({
      by: ['type'],
      where: {
        NOT: {
          attendance: null
        },
        date: {
          lte: parsedDateEnd,
          gte: parsedDateStart
        }
      },
      _sum: {
        value: true,
        //paidValue: true
      },
      _count: {
        attendanceId: true
      },
      orderBy: {
        type: 'asc'
      }
    })

    const grooming = await prisma.extract.groupBy({
      by: ['type'],
      where: {
        NOT: {
          booking: null
        },
        date: {
          lte: parsedDateEnd,
          gte: parsedDateStart
        }
      },
      _sum: {
        value: true,
        //paidValue: true
      },
      _count: {
        bookingId: true
      },
      orderBy: {
        type: 'asc'
      }
    })

    const others = await prisma.extract.groupBy({
      by: ['type'],
      where: {
        attendance: null,
        booking: null,
        date: {
          lte: parsedDateEnd,
          gte: parsedDateStart
        }
      },
      _sum: {
        value: true,
        //paidValue: true
      },
      _count: {
        id: true
      },
      orderBy: {
        type: 'asc'
      }
    })

    const all = await prisma.extract.groupBy({
      by: ['type'],
      where: {
        date: {
          lte: parsedDateEnd,
          gte: parsedDateStart
        }
      },
      _sum: {
        value: true,
        //paidValue: true
      },
      _count: {
        id: true
      },
      orderBy: {
        type: 'asc'
      }
    })


    return {daycare: daycare, grooming:grooming, others: others, all: all}
  }

}