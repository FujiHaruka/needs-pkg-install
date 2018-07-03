const {readFile} = require('fs')
const {promisify} = require('util')
const readFileAsync = promisify(readFile)

const readJson = async (path) => {
  return JSON.parse(await readFileAsync(path, 'utf8'))
}

module.exports = {
  readJson,
}
