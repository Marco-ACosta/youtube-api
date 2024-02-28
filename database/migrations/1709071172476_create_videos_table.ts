import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'videos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.string('title').notNullable()
      table.string('description').notNullable().nullable()
      table.string('url').notNullable().nullable()

      table.uuid('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.timestamp('published_at', { useTz: false }).nullable()
      table.timestamp('deleted_at', { useTz: false }).nullable()
      table.timestamp('created_at', { useTz: false }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: false }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
