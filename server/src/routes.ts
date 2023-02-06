import { prisma } from './lib/prisma'
import { FastifyInstance} from 'fastify'
import { z } from 'zod'
import dayjs from 'dayjs'
import { userRoutes } from './modules/User/User.route'
import { ownerRoutes } from './modules/Owner/Owner.route'
import { dogRoutes } from './modules/Dog/Dog.route'
import { attendanceRoutes } from './modules/Attendance/Attendance.route'
import { vaccineRoutes } from './modules/Vaccine/Vaccine.route'

export async function appRoutes(app: FastifyInstance){

  app.register(userRoutes, {prefix: '/api/users'})
  app.register(ownerRoutes, {prefix: '/api/owners'})
  app.register(dogRoutes, {prefix: '/api/dogs'})
  app.register(attendanceRoutes, {prefix: '/api/attendance'})
  app.register(vaccineRoutes, {prefix: '/api/vaccine'})

}

