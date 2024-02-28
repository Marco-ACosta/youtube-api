import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.string('name').nullable()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()

      table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: false }).defaultTo(this.now())
      table.timestamp('deleted_at', { useTz: false }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
