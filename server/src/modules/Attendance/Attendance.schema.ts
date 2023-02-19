import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const createAttendanceBody = z.object({
  owner_id: z.string(),
  dog_id: z.string(),
  date: z.string(),
  fullDay: z.boolean(),
  paid: z.boolean(),
  value: z.number(),
  descriptionValue: z.string()
})

const filterAttendance = z.object({
  dateStart: z.coerce.date(),
  dateEnd: z.coerce.date(),
})

const dogsAttendance = z.object({
  id: z.string(),
  name: z.string(),
  date: z.array(z.coerce.date())
})

export type AttendanceInput = z.infer<typeof createAttendanceBody>

export type AttendanceFilterInput = z.infer<typeof filterAttendance>

export type DogsAttendanceResult = z.infer<typeof dogsAttendance>

export const {schemas: attendanceSchemas, $ref} = buildJsonSchemas({
  createAttendanceBody,
  filterAttendance
}, { $id: "AttendanceSchemas" })