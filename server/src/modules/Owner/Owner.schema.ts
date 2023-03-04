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

export type UpdateOwnerInput = z.infer<typeof updateOwnerBody>

export const {schemas: ownerSchemas, $ref} = buildJsonSchemas({
  createOwnerSchema,
  createOwnerResponseSchema,
  updateOwnerBody,
  updateOwnerId
}, { $id: "OwnerSchemas" })