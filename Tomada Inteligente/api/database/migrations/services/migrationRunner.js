const migrationList = require('../migrationList')
const MigrationService = require('./migrationService')

class MigrationRunner {
  constructor() {
    this.MigrationService = new MigrationService('1_create_migrationHistorySchema')
    this.migrations = migrationList.map(migration => require(migration))
  }

  async runAll() {
    try {
      for(let migration of this.migrations) {
        const canBeRun = await this.MigrationService.checkHistory(migration.name, 'RUN')
        if(canBeRun)
          await migration.up()
      }

      return 'All migrations were successfully run!'
    } catch (error) {
      return error.message
    }
  }

  async runOne(migration) {
    try {
      let found = false
      for(let getOne of this.migrations) {
        if(getOne.name === migration) {
          found = true
          const canBeRun = await this.MigrationService.checkHistory(getOne.name, 'RUN')
          if(canBeRun) {
            await getOne.up()
            break
          } 

          return 'Nothing to migrate'
        }
      }
      
      return found ? 'Migration was run!' : 'Migration was not found.'
    } catch (error) {
      return error.message
    }
  }

  async dropAll() {
    try {
      const reverseOrder = this.migrations.reverse()
      for(let migration of reverseOrder) {
        const canBeDropped = await this.MigrationService.checkHistory(migration.name, 'DROP')
        if(canBeDropped) await migration.down()
      }

      return 'All migrations were successfully dropped!'
    } catch (error) {
      return error.message
    }
  }

  async dropOne(migration) {
    try {
      let found = false
      for(let getOne of this.migrations) {
        if(getOne.name === migration) {
          found = true
          const canBeDropped = await this.MigrationService.checkHistory(getOne.name, 'DROP')
          if(canBeDropped) {
            await getOne.down()
            break
          } 
          
          return 'Nothing to drop'
        }
      }

      return found ? 'Migration was dropped!' : 'Migration was not found.'
    } catch (error) {
      return error.message
    }
  }

  async dropLast() {
    try {
      let getLast = ''
      const reversed = this.migrations.reverse()

      for(let migration of reversed) {
        const exists = await this.MigrationService.existsOnHistory(migration.name)
        if(exists) {
          getLast = migration
          break
        }
      }

      const canBeDropped = await this.MigrationService.checkHistory(getLast.name, 'DROP')
      if(canBeDropped) {
        await getLast.down()
        return 'Last migration was dropped!'
      }

      return 'Nothing to drop'
    } catch (error) {
      return error.message
    }
  }
}

module.exports = new MigrationRunner