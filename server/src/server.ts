import fastify, { FastifyReply, FastifyRequest } from "fastify";
import {fastifyJwt} from "@fastify/jwt"
import cors from '@fastify/cors'
import { appRoutes } from "./routes";
import { userSchemas } from "./modules/User/User.schema";
import { ownerSchemas } from "./modules/Owner/Owner.schema";
import { dogSchemas } from "./modules/Dog/Dog.schema";
import { vaccinesSchemas } from "./modules/Vaccine/Vaccine.schema";
import { attendanceSchemas } from "./modules/Attendance/Attendance.schema";

export const app = fastify({ logger: true })

declare module  "fastify" {
  export interface FastifyInstance {
    authenticate: any
  }
}

//Schemas
for(const schemas of [...userSchemas, ...ownerSchemas, ...dogSchemas, ...vaccinesSchemas, ...attendanceSchemas]) { app.addSchema(schemas)}

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

app.listen(process.env.PORT || 3000/*,  '0.0.0.0'*/ , function (err, address) {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`server listening on ${address}`)
})

