import Video from '#models/video'
import { createVideoValidator } from '#validators/video_validator'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class VideosController {
  async index({}: HttpContext) {
    const videos = await Video.query()
    return videos
  }

  async store ({ request, response, auth }: HttpContext) {
   try {
      const data = await request.validateUsing(createVideoValidator)
      const { video, ...validData } = data
      const user = auth.getUserOrFail()

      const newVideo = await Video.create({ ...validData, user_id: user.id })
      await video.move(app.makePath('uploads'), {
        name: `${newVideo.id}.${video.extname}`
      })

      return response.created()
    }
    catch (error) {
      return response.send(error)
    }
  }
}
