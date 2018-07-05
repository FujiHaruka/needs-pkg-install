const {readFile, readdir, stat} = require('fs')
const {promisify} = require('util')

const readFileAsync = promisify(readFile)
const readdirAsync = promisify(readdir)
const isDirAsync = (path) => new Promise((resolve) => {
  stat(path, (err, stats) => err ? resolve(false) : resolve(stats.isDirectory()))
})

const readJson = async (path) => {
  return JSON.parse(await readFileAsync(path, 'utf8'))
}

module.exports = {
  readJson,
  readFileAsync,
  readdirAsync,
  isDirAsync,
}
