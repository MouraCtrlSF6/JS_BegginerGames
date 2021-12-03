require('dotenv').config()
const Database = require(`../../infra/${process.env.DATABASE}/queries`)

class MigrationHistorySchema {
  constructor() {
    this.name = '1_create_migrationHistorySchema'
  }
  
  async up() {
    const sql = `
      CREATE TABLE IF NOT EXISTS migration_History (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL,
        created_at DATE DEFAULT now()
      );
    `
    return await Database.raw(sql)
  }
  
  async down() {
    const sql = 'DROP TABLE IF EXISTS migration_History'
    return await Database.raw(sql)
  }
}

module.exports = new MigrationHistorySchema