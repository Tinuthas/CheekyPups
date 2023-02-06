import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const ownerCore = {
  nameOwner: z.string(),
  emailAddress: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string'
  }).email(),
  phoneOne: z.string()
}

const totalOwnerSchema = z.object({
  owner_id: z.string()
})

const totalOwnerResponse = z.object({
  total: z.string()
})

const createOwnerSchema = z.object({
  ...ownerCore,
  phoneTwo: z.string().nullable(),
  address: z.string().nullable(),
})

const createOwnerResponseSchema = z.object({
  id: z.number(),
  ...ownerCore
})

const payBody = {
  value: z.number(),
  description: z.string()
}

const createOwnerPayBody = z.object({
  owner_id: z.string(),
  ...payBody
})

const ownerPayResponseSchema = z.object({
  ...payBody,
  date: z.coerce.date()
})

export type TotalOwnerInput = z.infer<typeof totalOwnerSchema>

export type PayOwnerInput = z.infer<typeof createOwnerPayBody>

export const {schemas: ownerSchemas, $ref} = buildJsonSchemas({
  createOwnerSchema,
  createOwnerResponseSchema,
  totalOwnerSchema,
  totalOwnerResponse,
  createOwnerPayBody,
  ownerPayResponseSchema
}, { $id: "OwnerSchemas" })