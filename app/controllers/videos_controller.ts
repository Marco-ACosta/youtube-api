import Video from '#models/video'
import type { HttpContext } from '@adonisjs/core/http'

export default class VideosController {
  async index({}: HttpContext) {
    const videos = await Video.query()
    return videos
  }
}
