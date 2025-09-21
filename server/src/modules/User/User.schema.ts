import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const userCore = {
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string'
  }).email(),
  name: z.string()
}

const createUserSchema = z.object({
  ...userCore,
  admin: z.boolean({required_error: 'Password is required'}),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string'
  })
})

const createUserResponseSchema = z.object({
  id: z.number(),
  ...userCore,

})

const loginSchema = z.object({
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string'
  }).email(),
  password: z.string()
})

const loginResponseSchema = z.object({
  accessToken: z.string()
})

const updateUserBody = z.object({
  ...userCore,
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export type LoginInput = z.infer<typeof loginSchema>

export type UpdateUsersInput = z.infer<typeof updateUserBody>

export const {schemas: userSchemas, $ref} = buildJsonSchemas({
  createUserSchema, 
  createUserResponseSchema,
  loginSchema,
  loginResponseSchema,
  updateUserBody
}, { $id: "UserSchemas" } )