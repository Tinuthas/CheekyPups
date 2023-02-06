import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { $ref, CreateVaccineInput } from "./Vaccine.schema";

export async function vaccineRoutes(app: FastifyInstance) {

  app.post('/vaccine', {
    schema: {
      body: $ref('createVaccineSchema'),
    },
    preHandler: [app.authenticate]
  }, createVaccineHandle)
   
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

  const parsedVaccine = dayjs(dateVaccine).startOf('day')

  let vaccine = await prisma.vaccine.create({
    data:{
      dateVaccine: parsedVaccine.toISOString(),
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