import type { HttpContext } from '@adonisjs/core/http'
import { createUserValidator, userLoginValidator } from '#validators/user_validator'
import User from '#models/user'

export default class UsersController {
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createUserValidator)
      const user = await User.create(data)
      return response.created({ user })
    } catch (error) {
      return response.send(error)
    }
  }

  async login({ request, response }: HttpContext) {
    const data = await request.validateUsing(userLoginValidator)
    const user = await User.verifyCredentials(data.email, data.password)
    console.log({ user })
    const token = await User.accessTokens.create(user)
    return response.ok({ token })
  }
}
