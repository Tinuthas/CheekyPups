import { prisma } from '../../lib/prisma'
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { $ref, InfoGetALLInput, InfoGetURLInput } from './Info.schema';
import {z} from 'zod'
import { hashPassword, verifyPassword } from '../../lib/hash';
import { app } from '../../server';
import {sha1,sha256,sha384,sha512} from 'crypto-hash';
import { decrypt, decryptCustomerLink, encrypt, encryptCustomerLink, keyGen } from '../../lib/encryption';
import { Decimal } from '@prisma/client/runtime';


export async function infoRoutes(app: FastifyInstance) {

  app.get('/info', {
      schema: {
        querystring: $ref('getInfoURLSchema')
      },preHandler: [app.authenticate]},
  getInfoURLHandle)

  app.get('/customer', {
      schema: {
        querystring: $ref('getInfoAllSchema')
      },preHandler: [app.authenticate]},
  getInfoAllHandle)
}

async function getInfoURLHandle(request:FastifyRequest<{Querystring: InfoGetURLInput}>, reply: FastifyReply) {
  try{
    return await getInfoURL(request.query.id)
  }catch(err:any) {
    reply.code(400).send('Error in getting link customer: ' + err.message as string)
  }
}

async function getInfoURL(id: number) {
 let owner = await prisma.owner.findUnique({
    where: {
      id: id,
    }
  })

  if(owner == undefined || owner == null || owner.phoneOne == null)
    throw new Error('Not found')

  return encryptCustomerLink(owner.id)
}


async function getInfoAllHandle(request:FastifyRequest<{Querystring: InfoGetALLInput}>, reply: FastifyReply) {
  try{
    return await getInfoAll(request.query.code)
  }catch(err:any) {
    reply.code(400).send('Error in getting link customer: ' + err.message as string)
  }
}


async function getInfoAll(code: string) {
 
  let decrypted = Number(decryptCustomerLink(code))
 
  let owner = await prisma.owner.findUnique({
    where: {
      id: decrypted,
    },
    select: {
      id: true,
      name: true,
      type: true,
      dogs: {
        select: {
          name: true,
          breed: true,
        }
      }
    }
  })

  if(owner == undefined || owner == null || owner.id == null)
    throw new Error('Not found')

  let info = await prisma.extract.findMany({
    where: {
      ownerId: decrypted,
      done: false,
    },
    select: {
      value: true,
      attendance: {
        select: {
          typeDay: true
        }
      },
      booking: {
        select: {
          extract: {
            select: {
              value: true
            }
          }
        }
      }
    }
  })

  var grooming:number = 0.0
  var daycareTotal:number = 0.0
  var fullday = 0
  var halfday = 0
  var others:number = 0
  var total:number = 0

  info.forEach(payment => {
    total += Number(payment.value)
    if(payment.attendance!= undefined && payment.attendance != null) {
      daycareTotal+=Number(payment.value)
      if(payment.attendance.typeDay == 'HD') {
        halfday += 1
      }else{
        fullday += 1
      }
    }else if(payment.booking!= undefined && payment.booking != null) {
      grooming += Number(payment.booking.extract?.value)
    }else {
      others += Number(payment.value)
    }
  })

  



  return {owner, total, fullday, halfday, others, grooming, daycareTotal}
  
}

