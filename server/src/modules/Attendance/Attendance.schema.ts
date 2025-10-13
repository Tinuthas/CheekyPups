import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const createAttendanceBody = z.object({
  firstDogId: z.number(),
  firstDogTypeDay: z.string().max(2),
  firstDogValue: z.number(),
  secondDogId: z.number().nullable(),
  secondDogTypeDay: z.string().max(2).nullable(),
  secondDogValue: z.number().nullable(),
  thirdDogId: z.number().nullable(),
  thirdDogTypeDay: z.string().max(2).nullable(),
  thirdDogValue: z.number().nullable(),
  fourthDogId: z.number().nullable(),
  fourthDogTypeDay: z.string().max(2).nullable(),
  fourthDogValue: z.number().nullable(),
  date: z.string(),
  paid: z.boolean(),
  paidValue: z.string().nullable(),
  typePaid: z.string().nullable(),
  descriptionValue: z.string()
})

const createAttendanceWeekBody = z.object({
  dogId: z.number(),
  firstDayDate: z.string().nullable(),
  firstDayTypeDay: z.string().max(2).nullable(),
  firstDayValue: z.number().nullable(),
  firstDayDescription: z.string().nullable(),
  secondDayDate: z.string().nullable(),
  secondDayTypeDay: z.string().max(2).nullable(),
  secondDayValue: z.number().nullable(),
  secondDayDescription: z.string().nullable(),
  thirdDayDate: z.string().nullable(),
  thirdDayTypeDay: z.string().max(2).nullable(),
  thirdDayValue: z.number().nullable(),
  thirdDayDescription: z.string().nullable(),
  fourthDayDate: z.string().nullable(),
  fourthDayTypeDay: z.string().max(2).nullable(),
  fourthDayValue: z.number().nullable(),
  fourthDayDescription: z.string().nullable(),
  fifthDayDate: z.string().nullable(),
  fifthDayTypeDay: z.string().max(2).nullable(),
  fifthDayValue: z.number().nullable(),
  fifthDayDescription: z.string().nullable(),
  paid: z.boolean(),
  paidValue: z.string().nullable(),
  typePaid: z.string().nullable()
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
  typeDay: z.string().max(2),
  paid: z.boolean(),
  paidValue: z.number().nullable(),
  typePaid: z.string().nullable(),
  value: z.number(),
  descriptionValue: z.string()
})

const updateAttendancePay = z.object({
  done: z.boolean(),
  paidValue: z.number().nullable(),
  typePaid: z.string().nullable(),
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
export type AttendanceWeekInput = z.infer<typeof createAttendanceWeekBody>

export const {schemas: attendanceSchemas, $ref} = buildJsonSchemas({
  createAttendanceBody,
  filterAttendance,
  updateAttendanceBody,
  updateAttendanceId,
  updateAttendancePay,
  createAttendanceWeekBody
}, { $id: "AttendanceSchemas" })