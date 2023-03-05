import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const dogBase = {
  birthdayDate: z.coerce.date().nullable(),
  gender: z.string().nullable(),
  colour: z.string().nullable(),
  breed: z.string()
}

const vaccineBase = {
  dateVaccine: z.coerce.date(),
  typeVaccine: z.string()
}

const createOwnerDogBody = z.object({
  nameOwner: z.string(),
  phoneOne: z.string(),
  phoneTwo: z.string().nullable(),
  emailAddress: z.string(),
  address: z.string().nullable(),
  nameDog: z.string(),
  ...dogBase,
  ...vaccineBase
})

const createDogVaccineBody = z.object({
  owner_id: z.number(),
  nameDog: z.string(),
  ...dogBase,
  ...vaccineBase
})

const createDogBody = z.object({
  owner_id: z.number(),
  name: z.string(),
  ...dogBase,
})

export type DogVaccineInput = z.infer<typeof createDogVaccineBody>
export type DogInput = z.infer<typeof createDogBody>
export type DogOwnerInput = z.infer<typeof createOwnerDogBody>

export const {schemas: dogSchemas, $ref} = buildJsonSchemas({
  createOwnerDogBody,
  createDogVaccineBody,
  createDogBody
}, { $id: "DogSchemas" })