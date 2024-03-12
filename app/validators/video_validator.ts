import vine from '@vinejs/vine'

export const createVideoValidator = vine.compile(
  vine.object({
    title: vine.string().trim(),
    description: vine.string().trim(),
    url: vine.string().url().trim(),
    published_at: vine.date().optional(),
    video: vine.file({
      size: '512mb',
      extnames: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm', 'avchd', 'ogg'],
    }),
    thumb: vine.file({
      size: '512mb',
      extnames: ['png', 'jpg', 'jpeg'],
    }),
  })
)

export const updateVideoValidator = vine.compile(
  vine.object({
    title: vine.string().trim().optional(),
    description: vine.string().trim().optional(),
    url: vine.string().url().trim().optional(),
    published_at: vine.date().optional(),
    video: vine
      .file({
        size: '512mb',
        extnames: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm', 'avchd', 'ogg'],
      })
      .optional(),
    thumb: vine.file({
      size: '512mb',
      extnames: ['png', 'jpg', 'jpeg'],
    }),
  })
)
