const Database = require(`../../infra/${process.env.DATABASE}/queries`)

class MigrationService {
  constructor(migrationHistoryName) {
    this.migrationHistoryName = migrationHistoryName
  }

  async 

  async runEvent(migrationExists, migrationName) {
    if(!migrationExists) {
      const addToHistory = `
        INSERT INTO migration_history (migration_name)
        VALUES ($1)
      `
      await Database.raw(addToHistory, [migrationName])
      console.log(migrationName)
    }
    return !migrationExists
  }

  async dropEvent(migrationExists, migrationName) {
    if(migrationExists) {
      const removeFormHistory = `
        DELETE FROM migration_history 
        WHERE migration_name = '${migrationName}'
      `
      console.log(migrationName)
      await Database.raw(removeFormHistory)
    }
    return migrationExists
  }

  async altEvents(migrationName, action) {
    const historyExists = await this.historyExists()
    if(historyExists) return false
    return migrationName === this.migrationHistoryName && action === 'RUN'
  }

  routinePicker(action, migrationExists, migrationName) {
    const routines = {
      RUN: () => this.runEvent(migrationExists, migrationName),
      DROP: () => this.dropEvent(migrationExists, migrationName),
      ALTS: () => this.altEvents(migrationName, action),
    }
    if(this.historyExists() && this.migrationHistoryName !== migrationName) 
      return routines[action](migrationExists)

    return routines.ALTS(migrationName, action)
  }
  
  async checkHistory(migrationName, action) {    
    const migrationExists = await this.historyExists()
      ? await this.existsOnHistory(migrationName)
      : false
    
    return this.routinePicker(action, migrationExists, migrationName)
  }

  async existsOnHistory(migrationName) {
    const checkIfMigration = `
      SELECT id 
      FROM migration_history 
      WHERE migration_name = '${migrationName}'
    `
  
    const { rows: historyRows } = await Database.raw(checkIfMigration)
    const migrationExists = !!historyRows[0]

    return migrationExists
  }

  async historyExists() {
    const checkIfExists = `
      SELECT EXISTS (
        SELECT * FROM information_schema.tables 
        WHERE table_name = 'migration_history'
      );
    `
    const { rows: schemaRows } = await Database.raw(checkIfExists)
    const { exists } = schemaRows[0]
    return exists
  }
}

module.exports = MigrationService