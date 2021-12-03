const Conection = require('./conection.js')

class PostgreSQLQueries {
  getColumns(tableName) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT column_name 
        FROM information_schema.columns
        WHERE table_name = '${tableName}'
      `
      this.queryBuilder(sql)
        .then(query => {
          const { rows } = query
          const allFields = rows.map(row => row.column_name)
          resolve(allFields)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  raw(sql, values = []) {
    return new Promise((resolve, reject) => {
      this.queryBuilder(sql, values)
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
  }

  index(tableName) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${tableName}`
      this.queryBuilder(sql)
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
  }

  store(tableName, queryData) {
      return new Promise((resolve, reject) => {
        const sql = `
          INSERT INTO ${tableName}(${queryData.storeInColumns.join(',')})
          VALUES(${queryData.formattedValues.join(',')})
        `
        this.queryBuilder(sql, queryData.orderedValues)
          .then(data => resolve(data))
          .catch(error => reject(error))
      })
  } 

  update(tableName, queryData) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE ${tableName}
        SET ${queryData.updatedColumn} = '${queryData[queryData.updatedColumn]}'
        WHERE ${queryData.mainIdentifier} = '${queryData[queryData.mainIdentifier]}'
      `
      this.queryBuilder(sql)
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
  }

  remove(tableName, queryData) {
    return new Promise((resolve, reject) => {
      const sql = `
        DELETE FROM ${tableName} 
        WHERE ${queryData.mainIdentifier} = '${queryData[queryData.mainIdentifier]}'
      `
      this.queryBuilder(sql)
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
  }

  show(tableName, queryData){
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM ${tableName} 
        WHERE ${queryData.mainIdentifier} = '${queryData[queryData.mainIdentifier]}'
      `
      this.queryBuilder(sql)
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
  }

  queryBuilder(sql, values = []) {
    return new Promise(async (resolve, reject) => {
      try {
        const queryResult = await Conection.query(sql, values)
        resolve(queryResult)
      } catch(error) {
        reject(error)
      }
    })
  }
}

module.exports = new PostgreSQLQueries