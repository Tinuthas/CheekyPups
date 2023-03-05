import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const dogBase = {
  gender: z.string().nullable(),
  colour: z.string().nullable(),
  breed: z.string()
}

const updateDogId = z.object({
  id: z.number()
})

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
  birthdayDate: z.coerce.date().nullable(),
  ...dogBase,
  ...vaccineBase
})

const createDogVaccineBody = z.object({
  owner_id: z.number(),
  nameDog: z.string(),
  birthdayDate: z.coerce.date().nullable(),
  ...dogBase,
  ...vaccineBase
})

const createDogBody = z.object({
  owner_id: z.number(),
  name: z.string(),
  birthdayDate: z.string().nullable(),
  ...dogBase,
})

const updateDogBody = z.object({
  name: z.string(),
  birthdayDate: z.string().nullable(),
  ...dogBase,
})

export type DogVaccineInput = z.infer<typeof createDogVaccineBody>
export type DogInput = z.infer<typeof createDogBody>
export type DogOwnerInput = z.infer<typeof createOwnerDogBody>
export type UpdateDogInput = z.infer<typeof updateDogBody>

export const {schemas: dogSchemas, $ref} = buildJsonSchemas({
  updateDogId,
  createOwnerDogBody,
  createDogVaccineBody,
  createDogBody,
  updateDogBody,
}, { $id: "DogSchemas" })