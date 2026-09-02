import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const getInfoURLSchema = z.object({
  id: z.number()
})

const getInfoAllSchema = z.object({
  code: z.string()
})

export type InfoGetURLInput = z.infer<typeof getInfoURLSchema>
export type InfoGetALLInput = z.infer<typeof getInfoAllSchema>

export const {schemas: infoSchemas, $ref} = buildJsonSchemas({
  getInfoURLSchema,
  getInfoAllSchema
}, { $id: "InfoSchemas" } )