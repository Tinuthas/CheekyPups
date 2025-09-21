import { prisma } from '../../lib/prisma'
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { $ref, CreateUserInput, LoginInput, UpdateUsersInput } from './User.schema';
import {z} from 'zod'
import { hashPassword, verifyPassword } from '../../lib/hash';
import { app } from '../../server';



export async function userRoutes(app: FastifyInstance) {

  app.post('/', {
    schema: {
      body: $ref('createUserSchema'),
      response: {
        201: $ref('createUserResponseSchema')
      }
    }, preHandler: [app.authenticate]
  }, registerUserHandler)

  app.post('/login', {
    schema: {
      body: $ref('loginSchema'),
      response: {
        200: $ref('loginResponseSchema')
      }
    }
  }, loginHandler)

  app.get('/', {preHandler: [app.authenticate]}, getUsersHandler)

  app.put('/', {preHandler: [app.authenticate]}, updateUsersHandler)

  app.delete('/', {preHandler: [app.authenticate]}, deleteUsersHandler)
}

async function registerUserHandler(request: FastifyRequest<{Body: CreateUserInput}>, reply: FastifyReply) {
  try{
    const user = await createUser(request.body)
    return reply.code(201).send(user)
  }catch(err) {
    console.log(err)
    return reply.code(500).send(err)
  }

}

async function loginHandler(request: FastifyRequest<{Body: LoginInput}>, reply: FastifyReply) {
  try{
    const body = request.body
    const user = await findUserByEmail(body.email)
    if(!user) {
      return reply.code(401).send('Invalid email or password')
    }

    const correctPassword = verifyPassword({
      possiblePassword: body.password,
      salt: user.salt,
      hash: user.password
    })

    if(correctPassword) {
      const {password, salt, ...rest} = user
      return {accessToken: app.jwt.sign(rest)}
    }

    return reply.code(401).send('Invalid email or password')
    
  }catch(err) {
    console.log(err)
    return reply.code(500).send(err)
  }
}

async function getUsersHandler() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    }
  })
  return users
}

async function createUser(input: CreateUserInput) {
  const {password, ...rest} = input
  const {hash, salt} = hashPassword(password)
  const user = prisma.user.create({
    data: {...rest, salt, password: hash}
  })
  return user
}

async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    }
  })
}

async function updateUsersHandler(request: FastifyRequest<{Body: UpdateUsersInput, Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    return await updateUser(request.body, request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error update user')
  }
}

async function updateUser(input: UpdateUsersInput, id: number) {

  const {name, email } = input

  const user = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
      email
    }
  })
  return user
}



async function deleteUsersHandler(request: FastifyRequest<{Querystring: {id:number}}>, reply: FastifyReply) {
  try{
    return await deleteUser(request.query.id)
  }catch(err) {
    console.log(err)
    reply.code(400).send('Error in delete user')
  }
}

async function deleteUser(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id)
    },
  })
  if(user?.admin != true) {
    const userDeleted = await prisma.user.delete({
        where: {
          id: Number(id)
        },
      })
    return userDeleted
  }
  return user
  
}

