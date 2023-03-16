import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const createAttendanceBody = z.object({
  dog_id: z.number(),
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
  id: z.number(),
  name: z.string(),
  date: z.array(z.coerce.date())
})

const updateAttendanceBody = z.object({
  fullDay: z.boolean(),
  paid: z.boolean(),
  value: z.number(),
  descriptionValue: z.string()
})

const updateAttendancePay = z.object({
  descriptionValue: z.string()
})

const updateAttendanceId = z.object({
  id: z.number(),
})

export type AttendanceInput = z.infer<typeof createAttendanceBody>
export type AttendanceFilterInput = z.infer<typeof filterAttendance>
export type DogsAttendanceResult = z.infer<typeof dogsAttendance>
export type AttendanceUpdateInput = z.infer<typeof updateAttendanceBody>
export type AttendanceUpdatePayInput = z.infer<typeof updateAttendancePay>

export const {schemas: attendanceSchemas, $ref} = buildJsonSchemas({
  createAttendanceBody,
  filterAttendance,
  updateAttendanceBody,
  updateAttendanceId,
  updateAttendancePay
}, { $id: "AttendanceSchemas" })