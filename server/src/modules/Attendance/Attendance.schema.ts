import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const createAttendanceBody = z.object({
  owner_id: z.string(),
  dog_id: z.string(),
  date: z.string(),
  fullDay: z.boolean(),
  value: z.number(),
  descriptionValue: z.string()
})

export type AttendanceInput = z.infer<typeof createAttendanceBody>

export const {schemas: attendanceSchemas, $ref} = buildJsonSchemas({
  createAttendanceBody
}, { $id: "AttendanceSchemas" })