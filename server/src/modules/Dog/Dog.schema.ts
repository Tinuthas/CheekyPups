import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const dogBase = {
  nameDog: z.string(),
  birthdayDate: z.coerce.date().nullable(),
  gender: z.string().nullable(),
  colour: z.string().nullable(),
  breed: z.string(),
  dateVaccine: z.coerce.date(),
  typeVaccine: z.string()
}

const createOwnerDogBody = z.object({
  nameOwner: z.string(),
  phoneOne: z.string(),
  phoneTwo: z.string().nullable(),
  emailAddress: z.string(),
  address: z.string().nullable(),
  ...dogBase
})

const createDogBody = z.object({
  owner_id: z.string(),
  ...dogBase
})

export type DogInput = z.infer<typeof createDogBody>
export type DogOwnerInput = z.infer<typeof createOwnerDogBody>

export const {schemas: dogSchemas, $ref} = buildJsonSchemas({
  createOwnerDogBody,
  createDogBody
}, { $id: "DogSchemas" })