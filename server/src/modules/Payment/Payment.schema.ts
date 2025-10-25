import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const payBody = {
  value: z.number(),
  description: z.string()
}

const createPayBody = z.object({
  owner_id: z.number(),
  ...payBody,
  paid: z.boolean(),
  paidValue: z.number().nullable(),
  typePaid: z.string().nullable()
})

const createPayPaidBody = z.object({
  ...payBody,
  typePaid: z.string(),
  done: z.boolean(),
  paidValue: z.number(),
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

const updatePaymentBody = z.object({
  ...payBody,
})

const updatePaymentId = z.object({
  id: z.number()
})

const statusDone = z.object({
  all: z.boolean(),
  done: z.boolean(),
  startDate: z.string(),
  endDate: z.string()
})

const statusDoneExtracts = z.object({
  id: z.number(),
  all: z.boolean(),
  done: z.boolean(),
  startDate: z.string(),
  endDate: z.string()
})

const createPaymentOwnerAll = z.object({
  ownerId: z.number(),
  typePaid: z.string(),
  salesValue: z.number(),
  paidValue: z.number(),
})

const createTillNewDate = z.object({
  newValue: z.number(),
  description: z.string(),
  type: z.string().max(1),
})

export type TotalOwnerInput = z.infer<typeof totalOwnerSchema>
export type PayOwnerInput = z.infer<typeof createPayBody>
export type PaidOwnerInput = z.infer<typeof createPayPaidBody>
export type UpdatePaymentInput = z.infer<typeof updatePaymentBody>
export type CreatePaymentOwnerAllInput = z.infer<typeof createPaymentOwnerAll>
export type CreateNewTillInput = z.infer<typeof createTillNewDate>

export const {schemas: paymentSchemas, $ref} = buildJsonSchemas({
  createPayBody,
  createPayPaidBody,
  payResponseSchema,
  totalOwnerSchema,
  totalOwnerResponse,
  updatePaymentBody,
  updatePaymentId,
  statusDone,
  statusDoneExtracts,
  createPaymentOwnerAll,
  createTillNewDate
}, { $id: "PaymentSchemas" })