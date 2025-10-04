import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'


const prefBody = z.object({
  key: z.string(),
  value: z.string()
})

const prefRespondeBody = z.object({
  id: z.number(),
  key: z.string(),
  value: z.string()
})

export type PreferenceInput = z.infer<typeof prefBody>

export const {schemas: preferenceSchemas, $ref} = buildJsonSchemas({
  prefBody,
  prefRespondeBody
}, { $id: "PreferencesSchemas" } )