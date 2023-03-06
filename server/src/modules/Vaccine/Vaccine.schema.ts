import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const createVaccineSchema = z.object({
  dog_id: z.number(),
  dateVaccine: z.string(),
  typeVaccine: z.string()
})

const updateVaccineSchema = z.object({
  dateVaccine: z.string(),
  type: z.string()
})

const updateVaccineId = z.object({
  id: z.number(),
})

export type CreateVaccineInput = z.infer<typeof createVaccineSchema>
export type UpdateVaccineInput = z.infer<typeof updateVaccineSchema>

export const {schemas: vaccinesSchemas, $ref} = buildJsonSchemas({
  createVaccineSchema,
  updateVaccineSchema,
  updateVaccineId
}, { $id: "VaccineSchemas" } )