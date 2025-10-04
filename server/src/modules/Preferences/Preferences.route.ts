import { prisma } from '../../lib/prisma'
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { $ref, PreferenceInput } from './Preferences.schema'



export async function preferenceRoutes(app: FastifyInstance) {

   app.post('/', {
      schema: {
        body: $ref('prefBody'),
      },
      preHandler: [app.authenticate]
  }, registerPreferenceHandler)

  app.get('/', {preHandler: [app.authenticate]}, getPreferencesHandler)

  app.put('/', {preHandler: [app.authenticate]}, updatePreferenceHandler)

  app.delete('/', {preHandler: [app.authenticate]}, deletePreferenceHandler)
}

async function registerPreferenceHandler(request: FastifyRequest<{Body: PreferenceInput}>, reply: FastifyReply) {
  try{
    const pref = await createPreference(request.body)
    return reply.code(201).send(pref)
  }catch(err) {
    console.log(err)
    return reply.code(500).send(err)
  }

}

async function getPreferencesHandler() {
  const prefs = await prisma.preferences.findMany({
    select: {
      id: true,
      key: true,
      value: true,
    }
  })
  return prefs
}

async function createPreference(input: PreferenceInput) {
  const {key, value} = input
  const pref = prisma.preferences.create({
    data: {key, value}
  })
  return pref
}


async function updatePreferenceHandler(request: FastifyRequest<{Body: PreferenceInput, Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    return await updatePreference(request.body, request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error update pref')
  }
}

async function updatePreference(input: PreferenceInput, id: number) {

  const {key, value } = input

  const pref = await prisma.preferences.update({
    where: {
      id: Number(id),
    },
    data: {
      key,
      value
    }
  })
  return pref
}



async function deletePreferenceHandler(request: FastifyRequest<{Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    return await deletePreference(request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in delete pref')
  }
}

async function deletePreference(id: number) {
  const pref = await prisma.preferences.findUnique({
    where: {
      id: Number(id)
    },
  })
  const prefDeleted = await prisma.preferences.delete({
      where: {
        id: Number(id)
      },
  })
  return prefDeleted
}

