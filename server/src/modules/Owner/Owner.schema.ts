import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const ownerCore = {
  name: z.string(),
  emailAddress: z.string({
    invalid_type_error: 'Email must be a string'
  }).email().nullable(),
  phoneOne: z.string(),
  type: z.string({
    required_error: 'Type owner is required',
  }).max(1)
}

const createOwnerSchema = z.object({
  ...ownerCore,
  secondOwner: z.string().nullable(),
  phoneTwo: z.string().nullable(),
  address: z.string().nullable(),
  notes: z.string().nullable()
})

const updateOwnerBody = z.object({
  ...ownerCore,
  secondOwner: z.string().nullable(),
  phoneTwo: z.string().nullable(),
  address: z.string().nullable(),
  notes: z.string().nullable()
})

const updateOwnerId = z.object({
  id: z.number()
})

const filterTypeOwner = z.object({
  type: z.string().max(1)
})

const createOwnerResponseSchema = z.object({
  id: z.number(),
  ...ownerCore
})

const filterOwnerName = z.object({
  name: z.string(),
})

export type UpdateOwnerInput = z.infer<typeof updateOwnerBody>

export type CreateOwnerInput = z.infer<typeof createOwnerSchema>

export type FilterOwnerInput = z.infer<typeof filterOwnerName>

export type FilterOwnerTypeInput = z.infer<typeof filterTypeOwner>

export const {schemas: ownerSchemas, $ref} = buildJsonSchemas({
  createOwnerSchema,
  createOwnerResponseSchema,
  updateOwnerBody,
  updateOwnerId,
  filterOwnerName,
  filterTypeOwner,
}, { $id: "OwnerSchemas" })