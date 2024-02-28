import vine from '@vinejs/vine'
export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    email: vine
      .string()
      .email()
      .trim()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine.string().confirmed({ confirmationField: 'password_confirmation' }).trim(),
  })
)

export const userLoginValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .trim()
      .exists(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return user
      }),
    password: vine.string().trim(),
  })
)
