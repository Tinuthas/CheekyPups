import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const ownerCore = {
  name: z.string(),
  emailAddress: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string'
  }).email(),
  phoneOne: z.string()
}

const totalOwnerSchema = z.object({
  owner_id: z.number()
})

const totalOwnerResponse = z.object({
  total: z.string()
})

const createOwnerSchema = z.object({
  ...ownerCore,
  phoneTwo: z.string().nullable(),
  address: z.string().nullable(),
})

const updateOwnerBody = z.object({
  ...ownerCore,
  phoneTwo: z.string().nullable(),
  address: z.string().nullable(),
})

const updateOwnerId = z.object({
  id: z.number()
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
  owner_id: z.number(),
  ...payBody
})

const ownerPayResponseSchema = z.object({
  ...payBody,
  date: z.coerce.date()
})

export type TotalOwnerInput = z.infer<typeof totalOwnerSchema>

export type PayOwnerInput = z.infer<typeof createOwnerPayBody>

export type UpdateOwnerInput = z.infer<typeof updateOwnerBody>

export const {schemas: ownerSchemas, $ref} = buildJsonSchemas({
  createOwnerSchema,
  createOwnerResponseSchema,
  totalOwnerSchema,
  totalOwnerResponse,
  createOwnerPayBody,
  ownerPayResponseSchema,
  updateOwnerBody,
  updateOwnerId
}, { $id: "OwnerSchemas" })