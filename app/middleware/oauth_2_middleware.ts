import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
export default class Oauth2Middleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const output = await next()
    return output
  }
}