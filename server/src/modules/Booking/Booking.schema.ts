import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const createBookingBody = z.object({
  date: z.string(),
  status: z.string()
})

const filterBookingDate = z.object({
  date: z.string()
})

export type BookingInput = z.infer<typeof createBookingBody>
export type FilterBookingDateInput = z.infer<typeof filterBookingDate>

export const {schemas: bookingSchemas, $ref} = buildJsonSchemas({
  createBookingBody,
  filterBookingDate
}, { $id: "BookingSchemas" })