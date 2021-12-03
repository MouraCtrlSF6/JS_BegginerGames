//At app/database/migrations/migrationList, create a new file

require('dotenv').config()
const Database = require(`../../infra/${process.env.DATABASE}/queries`)

class ExampleMigration {
  constructor() {
    /* 
      Declare your migration name here, such as the following example:
      this.name = '2_create_tableSchema'

      Migration names pattern:
      <migration_num>_<action>_<description>

      actions: 
      - Create;
      - addInto;
      - remove;
      - update.

      As first migration is creating of migrations history table, 
      migration_num starts from '2'
    */
    this.name = '<migration_name>'
  }
  
  async up() {
    /* 
      Enter the sql script that will be run by running the migration.
      Example:

      const sql = `CREATE TABLE IF NOT EXISTS tableExample (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        description TEXT,
      );`
    */
    const sql = `<sql_content>`

    return await Database.raw(sql)
  }
  
  async down() {
    /* 
      Enter the sql script that will be run by dropping the migration.
      Example:

      const sql = 'DROP TABLE IF EXISTS tableExample;'
    */
    const sql = '<sql_content>'
    return await Database.raw(sql)
  }
}

/*
  Export your new migration as the following example:
  module.exports = new ExampleMigration

  Add a require statement of your new migration in file:
  app/database/migrations/migrationList.js 
*/