const MigrationRunner = require('./migrations/services/migrationRunner')
const stdinInput = process.argv.slice(2)

async function exec(method, parameter) {
  return await MigrationRunner[method](parameter) 
}
exec(stdinInput[0], stdinInput[1])
  .then((manager) => {
    console.log()
    console.log(manager)
    process.exit()
  })
  .catch((error) => {
    console.error()
    console.error(error)
    process.exit()
  })

