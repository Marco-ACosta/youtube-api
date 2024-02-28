import Video from '#models/video'
import { createVideoValidator } from '#validators/video_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class VideosController {
  async index({}: HttpContext) {
    const videos = await Video.query()
    return videos
  }

  async store ({ request, response, auth }: HttpContext) {
   try {
      const data = await request.validateUsing(createVideoValidator)
      const user = auth.getUserOrFail()
      const video = await Video.create({ ...data, user_id: user.id })
      return response.created({ video })
    }
    catch (error) {
      return response.send(error)
    }
  }
}
