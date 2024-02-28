import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'create_videos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().notNullable().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.string('title').notNullable()
      table.string('description').notNullable().nullable()
      table.string('url').notNullable().nullable()
      
      table
        .uuid('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
        .unsigned()
      
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