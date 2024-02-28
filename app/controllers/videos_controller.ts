import Video from '#models/video'
import type { HttpContext } from '@adonisjs/core/http'

export default class VideosController {
    public async index({}: HttpContext) {
        const videos = await Video.query()
        return videos
    }
}