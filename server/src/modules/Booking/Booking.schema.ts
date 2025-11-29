import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const createBookingBody = z.object({
  date: z.string(),
  status: z.string()
})

const filterBookingDate = z.object({
  date: z.string()
})

const dateFillSpacesBody = z.object({
  date: z.string()
})

const filterSearching = z.object({
  name: z.string()
})

const updateBookingId = z.object({
  id: z.number()
})

const createBookingNewCustomer = z.object({
  owner: z.string(),
  phone: z.string(),
  notes: z.string().nullable(),
  firstDogTime: z.string(),
  firstDogName: z.string(),
  firstDogBreed: z.string(),
  firstDogJob: z.string(),
  secondDogTime: z.string().nullable(),
  secondDogName: z.string().nullable(),
  secondDogBreed: z.string().nullable(),
  secondDogJob: z.string().nullable(),
  thirdDogTime: z.string().nullable(),
  thirdDogName: z.string().nullable(),
  thirdDogBreed: z.string().nullable(),
  thirdDogJob: z.string().nullable(),
  fourthDogTime: z.string().nullable(),
  fourthDogName: z.string().nullable(),
  fourthDogBreed: z.string().nullable(),
  fourthDogJob: z.string().nullable(),
})

const createBookingExistedCustomer = z.object({
  notes: z.string().nullable(),
  firstDogTime: z.number(),
  firstDogId: z.number(),
  firstDogJob: z.string().nullable(),
  secondDogTime: z.number().nullable(),
  secondDogId: z.number().nullable(),
  secondDogJob: z.string().nullable(),
  thirdDogTime: z.number().nullable(),
  thirdDogId: z.number().nullable(),
  thirdDogJob: z.string().nullable(),
  fourthDogTime: z.number().nullable(),
  fourthDogId: z.number().nullable(),
  fourthDogJob: z.string().nullable(),
})

const createBookingOffering = z.object({
  ownerId: z.string().nullable(),
  owner: z.string().nullable(),
  phone: z.string().nullable(),
  typeOffered: z.string(),
  notes: z.string(),
  firstDogTime: z.string(),
  secondDogTime: z.string().nullable(),
  thirdDogTime: z.string().nullable(),
  fourthDogTime: z.string().nullable()
})

const createBookingConfirmedOffer = z.object({
  bookingId: z.number(),
  dogId: z.string().nullable(),
  owner: z.string(),
  phone: z.string(),
  notes: z.string(),
  firstDogTime: z.string(),
  firstDogName: z.string(),
  firstDogBreed: z.string(),
  firstDogJob: z.string(),
})

const createBookingFinish = z.object({
  bookingId: z.number(),
  notes: z.string(),
  typePaid: z.string(),
  salesValue: z.number(),
  paid: z.boolean(),
  paidValue: z.number(),
  description: z.string()
})

const createEditOwner = z.object({
  dogId: z.number(),
  bookingId: z.number(),
  owner: z.string(),
  phone: z.string(),
  notes: z.string(),
  dogName: z.string(),
  dogBreed: z.string(),
  job: z.string(),
  second: z.boolean(),
  secondOwner: z.string().nullable(),
  secondPhone: z.string().nullable()
})

const updateEditNotes = z.object({
  job: z.string(),
  notes: z.string(),
})

const reminderBody = z.object({
  id: z.number(),
  bookingId: z.number()
})

export type BookingInput = z.infer<typeof createBookingBody>
export type FilterBookingDateInput = z.infer<typeof filterBookingDate>
export type DateFillSpacesBodyInput = z.infer<typeof dateFillSpacesBody>
export type FilterSearchingInput = z.infer<typeof filterSearching>
export type BookingCreateNewCustomer = z.infer<typeof createBookingNewCustomer>
export type BookingCreateExistedCustomer = z.infer<typeof createBookingExistedCustomer>
export type BookingOfferingInput = z.infer<typeof createBookingOffering>
export type BookingConfirmedOfferInput = z.infer<typeof createBookingConfirmedOffer>
export type BookingFinishInput = z.infer<typeof createBookingFinish>
export type BookingEditInput = z.infer<typeof createEditOwner>
export type BookingUpdateNotes = z.infer<typeof updateEditNotes>

export const {schemas: bookingSchemas, $ref} = buildJsonSchemas({
  createBookingBody,
  filterBookingDate,
  dateFillSpacesBody,
  filterSearching,
  createBookingNewCustomer,
  createBookingOffering,
  createBookingConfirmedOffer,
  createBookingExistedCustomer,
  createBookingFinish,
  createEditOwner,
  updateEditNotes,
  updateBookingId,
  reminderBody
}, { $id: "BookingSchemas" })