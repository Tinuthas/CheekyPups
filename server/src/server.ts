import fastify, { FastifyReply, FastifyRequest } from "fastify";

import {fastifyJwt} from "@fastify/jwt"
//import fastifyOpenapiDocs from 'fastify-openapi-docs'
import cors from '@fastify/cors'
import { appRoutes } from "./routes";
import { userSchemas } from "./modules/User/User.schema";
import { ownerSchemas } from "./modules/Owner/Owner.schema";
import { dogSchemas } from "./modules/Dog/Dog.schema";
import { vaccinesSchemas } from "./modules/Vaccine/Vaccine.schema";
import { attendanceSchemas } from "./modules/Attendance/Attendance.schema";
import { paymentSchemas } from "./modules/Payment/Payment.schema";
import { bookingSchemas } from "./modules/Booking/Booking.schema";
import { preferenceSchemas } from "./modules/Preferences/Preferences.schema";


export const app = fastify({ logger: true })

declare module  "fastify" {
  export interface FastifyInstance {
    authenticate: any
  }
}

/*app.register(fastifyOpenapiDocs, {
  openapi: {
    // All these fields are optional, but they should be provided to satisfy OpenAPI specification.
    openapi: '3.0.3',
    info: {
      title: 'Title',
      description: 'Description',
      contact: {
        name: 'Shogun',
        url: 'https://cowtech.it',
        email: 'shogun@cowtech.it'
      },
      license: {
        name: 'ISC',
        url: `https://choosealicense.com/licenses/isc/`
      },
      version: '1.0.0'
    },
    servers: [
      { url: 'https://example.com', description: 'Production Server' },
      { url: 'https://dev.example.com', description: 'Development Server' }
    ],
    tags: [{ name: 'service', description: 'Service' }],
    components: {
      securitySchemes: {
        jwtBearer: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  }
})*/

app.addSchema({
  type: 'object',
  $id: 'request',
  description: 'The request payload',
  properties: {
    id: {
      type: 'string',
      description: 'The operation id',
      pattern: '^.+$'
    }
  },
  required: ['id'],
  additionalProperties: false
})

app.addSchema({
  type: 'object',
  $id: 'response',
  description: 'The response payload',
  properties: {
    ok: {
      type: 'boolean',
      description: 'The operation response'
    }
  },
  required: ['ok'],
  additionalProperties: false
})

//Schemas
for(const schemas of [...userSchemas, ...ownerSchemas, ...dogSchemas, ...vaccinesSchemas, ...attendanceSchemas, ...paymentSchemas, ...bookingSchemas, ...preferenceSchemas]) { app.addSchema(schemas)}

app.register(require('@fastify/jwt'), { secret: process.env.SECRET_JWT })

app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
  try{
    await request.jwtVerify()
  }catch(e) {
    return reply.send(e)
  }
})

app.register(cors)
app.register(appRoutes)

app.listen({ port: 3333 }, 
  (err: any) => { if (err) throw err })

