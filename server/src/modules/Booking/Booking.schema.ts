import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const createBookingBody = z.object({
  date: z.string(),
  status: z.string()
})

const filterBookingDate = z.object({
  date: z.string()
})

const dateFillSpacesBody = z.object({
  date: z.string()
})

const filterSearching = z.object({
  name: z.string()
})

export type BookingInput = z.infer<typeof createBookingBody>
export type FilterBookingDateInput = z.infer<typeof filterBookingDate>
export type DateFillSpacesBodyInput = z.infer<typeof dateFillSpacesBody>
export type FilterSearchingInput = z.infer<typeof filterSearching>

export const {schemas: bookingSchemas, $ref} = buildJsonSchemas({
  createBookingBody,
  filterBookingDate,
  dateFillSpacesBody,
  filterSearching
}, { $id: "BookingSchemas" })