import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { $ref, CreateVaccineInput, UpdateVaccineInput } from "./Vaccine.schema";

export async function vaccineRoutes(app: FastifyInstance) {

  app.get('/', {preHandler: [app.authenticate]}, getAllVaccines)

  app.post('/', {
    schema: {
      body: $ref('createVaccineSchema'),
    },
    preHandler: [app.authenticate]
  }, createVaccineHandle)

  app.put('/', {
    schema: {
      body: $ref('updateVaccineSchema'),
      querystring: $ref('updateVaccineId'),
    },
    preHandler: [app.authenticate]
  }, updateVaccineHandle)

  app.delete('/', {
    schema: {
      params: {
        id: { type: 'number' },
      },
    }
  }, deleteVaccineHandle)
   
}

async function getAllVaccines(request: FastifyRequest, reply: FastifyReply) {
  try{

    var vacciness = await prisma.dog.findMany({
      where: {
        vaccines: { some: {} }
      },
      select: {
        name: true,
        nickname: true,
        vaccines: {
          select: {
            id: true,
            dateVaccine: true,
            type: true,
          },
          orderBy: {
            dateVaccine: 'desc'
          },
          take: 1,
        }
      }
    })

    const filterVacciness = vacciness.map(({ name, nickname,  vaccines}) => ({ 
      id: vaccines[0].id, 
      dateVaccine: vaccines[0].dateVaccine , 
      type: vaccines[0].type, 
      dog: `${name} ${nickname != null ?'- '+ nickname : ''}`.trim(), 
    }));
    return filterVacciness
    /*
    var vaccines = await prisma.vaccine.findMany({
      include: {
        dog: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {  
        dateVaccine: 'desc',
      },
    })

    const filterVaccines = vaccines.map(({ id, dateVaccine, type, dog }) => ({ id, dateVaccine, type, dog: dog.name }));
    return filterVaccines*/
  }catch(err) {
    console.log(err)
    reply.code(400).send("Error in get vaccines")
  }
}

async function createVaccineHandle(request: FastifyRequest<{Body: CreateVaccineInput}>, reply: FastifyReply) {
  try{
    createVaccine(request.body)
  }catch(err) {
    reply.code(400).send("Error in create vaccine")
  }
  
}

async function createVaccine(input: CreateVaccineInput) {
  const { dog_id, dateVaccine, typeVaccine } = input

  var dateParts:any[] = dateVaccine.split('/')
  var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
  var parsedVaccine = dayjs(dateObject).startOf('day').toISOString()
  
  let vaccine = await prisma.vaccine.create({
    data:{
      dateVaccine: parsedVaccine,
      type: typeVaccine,
      dog: {
        connect: {
          id: dog_id
        }
      }
    }
  })

  return vaccine
}

async function updateVaccineHandle(request: FastifyRequest<{Body: UpdateVaccineInput, Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    return await updateVaccine(request.body, request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in update vaccine')
  }
}

async function updateVaccine(input: UpdateVaccineInput, id: number) {
  const {dateVaccine, type } = input

  var dateParts:any[] = dateVaccine.split('/')
  var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
  var parsedVaccine = dayjs(dateObject).startOf('day').toISOString()

  let vaccine = await prisma.vaccine.update({
    where: {
      id: id
    },
    data: {
      dateVaccine: parsedVaccine,
      type
    }
  })

  return vaccine
}

async function deleteVaccineHandle(request: FastifyRequest<{Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    return await deleteVaccine(request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in delete vaccine')
  }
}

async function deleteVaccine(id: number) {
  const deleteVaccine = await prisma.vaccine.delete({
    where: {
      id: Number(id)
    },
  })
  return deleteVaccine
}