import Video from '#models/video'
import { createVideoValidator, updateVideoValidator } from '#validators/video_validator'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'
import fs from 'node:fs/promises'
export default class VideosController {
  // POST
  async store({ request, response, auth }: HttpContext) {
    try {
      const data = await request.validateUsing(createVideoValidator)
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { video, thumb, published_at, ...validData } = data
      const user = auth.getUserOrFail()
      const publishedAt = published_at ? DateTime.fromJSDate(published_at) : DateTime.utc()
      const newVideo = await Video.create({
        ...validData,
        published_at: publishedAt,
        user_id: user.id,
      })
      await video.move(app.makePath('uploads'), {
        name: `${newVideo.id}.${video.extname}`,
      })
      await thumb.move(app.makePath('uploads'), {
        name: `${newVideo.id}.${thumb.extname}`,
      })

      return response.created()
    } catch (error) {
      return response.send(error)
    }
  }

  // GET
  async index({ response, request }: HttpContext) {
    const { column, order, page, perPage } = request.qs()
    console.log({ column, order, page, perPage })
    const videos = await Video.query()
      .whereNull('deleted_at')
      .whereNotNull('published_at')
      .where('published_at', '<', new Date())
      .orderBy(column, order)
      .paginate(page, perPage)
    return response.ok(videos)
  }

  async show({ response, params }: HttpContext) {
    const video = await Video.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .whereNotNull('published_at')
      .where('published_at', '<', new Date())
      .first()
    return response.ok(video)
  }

  // PUT
  async update({ request, response, params, auth }: HttpContext) {
    const data = await request.validateUsing(updateVideoValidator)
    const videoOriginal = await Video.query().where('id', params.id).first()

    if (!videoOriginal) {
      return response.notFound()
    }
    if (videoOriginal.user_id !== auth.user?.id) {
      return response.unauthorized()
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { video, thumb, published_at, ...validData } = data
    const publishedAt = published_at ? DateTime.fromJSDate(published_at) : DateTime.utc()

    await videoOriginal.merge({ ...validData, published_at: publishedAt }).save()
    if (video) {
      await video.move(app.makePath('uploads'), {
        name: `${videoOriginal.id}.${video.extname}`,
      })
    }
    if (thumb) {
      await thumb.move(app.makePath('uploads'), {
        name: `${videoOriginal.id}.${thumb.extname}`,
      })
    }
    return response.created()
  }

  async restore({ params, response, auth }: HttpContext) {
    const video = await Video.query().where('id', params.id).whereNotNull('deleted_at').first()
    if (!video) {
      return response.notFound()
    }
    if (video.user_id !== auth.user?.id) {
      return response.unauthorized()
    }
    await video.merge({ deleted_at: null }).save()
    return response.ok({ message: 'Video restored successfully' })
  }

  // DELETE
  async delete({ params, response, auth }: HttpContext) {
    const video = await Video.query().where('id', params.id).whereNull('deleted_at').first()

    if (!video) {
      return response.notFound()
    }
    if (video.user_id !== auth.user?.id) {
      return response.unauthorized()
    }

    await video.merge({ deleted_at: DateTime.utc() }).save()
    return response.ok({ message: 'Video deleted successfully' })
  }

  async destroy({ params, response, auth }: HttpContext) {
    const video = await Video.query().where('id', params.id).first()
    if (!video) {
      return response.notFound()
    }
    if (video.user_id !== auth.user?.id) {
      return response.unauthorized()
    }

    const videoPath = app.makePath(`uploads/${video.id}.mp4`)
    const imagePath = app.makePath(`uploads/${video.id}.jpg`)

    try {
      fs.unlink(videoPath)
    } catch {}
    try {
      fs.unlink(imagePath)
    } catch {}

    await video.delete()
    return response.ok({ message: 'Video deleted successfully' })
  }
}
