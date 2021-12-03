require('dotenv').config()
const DataService = require('../validators/DataValidator')
const Database = require(`../../database/infra/${process.env.DATABASE}/queries`)
const NOT_REQUIRABLE = ['id']

class Model {
  constructor(tableName, mainIdentifier, notRequired = [...NOT_REQUIRABLE]) {
    this.tableName = tableName.toLowerCase()
    this.mainIdentifier = mainIdentifier
    this.notRequired = notRequired.includes(...NOT_REQUIRABLE) 
      ? notRequired
      : [...notRequired, ...NOT_REQUIRABLE] 
  }

  index() {
    return Database.index(this.tableName)
  }

  async store(payload) {
    const validPayload = await DataService.validateStoreData(
      this.tableName, 
      this.notRequired, 
      payload
    )

    if(!validPayload.valid) {
      const error = new Error(validPayload.description)
      error.status = validPayload.status
      throw error
    }
        
    let storeInColumns = await Database.getColumns(this.tableName)
    storeInColumns = storeInColumns.filter(column => !NOT_REQUIRABLE.includes(column))
    const orderedValues = storeInColumns.map(column => payload[column])
    const formattedValues = Object.keys(storeInColumns).map(index => `$${parseInt(index)+1}`)

    const queryData = {
      storeInColumns,
      orderedValues,
      formattedValues
    }

    return Database.store(this.tableName, queryData)
  }

  async update(payload, identifier) {
    const validPayload = await DataService.validateUpdateData(
      this.tableName, 
      this.notRequired, 
      payload
    )
    
    if(!validPayload.valid) {
      const error = new Error(validPayload.description)
      error.status = validPayload.status
      throw error
    }
    
    for(let key of Object.keys(payload)) {
      let updateEvent = {}
      let hasErrors = false
      const queryData = {
        mainIdentifier: this.mainIdentifier,
        [this.mainIdentifier]: identifier, 
        updatedColumn: key,
        [key]: payload[key]
      }
      
      await Database.update(this.tableName, queryData)
        .then(query => {
          updateEvent = query
        })
        .catch(error => {
          updateEvent = error
          hasErrors = true
        })
      
      if(hasErrors) {
        const error = new Error(updateEvent.message)
        error.status = 500
        throw error
      }

      if(!updateEvent.rowCount) {
        const error = new Error('Data row not found')
        error.status = 404
        throw error
      }
    }

    return true
  }

  remove(identifier) {
    const queryData = {
      mainIdentifier: this.mainIdentifier,
      [this.mainIdentifier]: identifier
    }

    return Database.remove(this.tableName, queryData)
  }

  show(identifier) {
    const queryData = {
      mainIdentifier: this.mainIdentifier,
      [this.mainIdentifier]: identifier
    }

    return Database.show(this.tableName, queryData)
  }
}

module.exports = Model