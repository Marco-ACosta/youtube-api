import vine from '@vinejs/vine'

export const createVideoValidator = vine.compile(
  vine.object({
    title: vine.string().trim(),
    description: vine.string().trim(),
    url: vine.string().url().trim(),
    video: vine.file({
      size: '512mb',
      extnames: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm', 'avchd', 'ogg'],
    }),
    thumb: vine.file({
      size: '512mb',
      extnames: ['png', 'jpg', 'jpeg'],
    }).optional()
  })
)