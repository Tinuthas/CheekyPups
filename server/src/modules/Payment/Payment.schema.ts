import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const payBody = {
  value: z.number(),
  description: z.string()
}

const createPayBody = z.object({
  owner_id: z.number(),
  ...payBody
})

const payResponseSchema = z.object({
  ...payBody,
  date: z.coerce.date()
})

const totalOwnerSchema = z.object({
  owner_id: z.number()
})

const totalOwnerResponse = z.object({
  total: z.string()
})

export type TotalOwnerInput = z.infer<typeof totalOwnerSchema>

export type PayOwnerInput = z.infer<typeof createPayBody>

export const {schemas: paymentSchemas, $ref} = buildJsonSchemas({
  createPayBody,
  payResponseSchema,
  totalOwnerSchema,
  totalOwnerResponse
}, { $id: "PaymentSchemas" })