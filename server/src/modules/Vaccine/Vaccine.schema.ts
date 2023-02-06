import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const createVaccineSchema = z.object({
  dog_id: z.string(),
  dateVaccine: z.coerce.date(),
  typeVaccine: z.string()
})

export type CreateVaccineInput = z.infer<typeof createVaccineSchema>

export const {schemas: vaccinesSchemas, $ref} = buildJsonSchemas({
  createVaccineSchema
}, { $id: "VaccineSchemas" } )