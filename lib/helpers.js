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

const compareDependency = async ({
  dependency,
  nodeModules,
  pkgLock,
}) => {
  const installedVersion = await nodeModules.versionOf(dependency)
  if (!installedVersion) {
    return {
      equals: false,
      detail: {
        [dependency.name]: 'Not found in node_modules',
      }
    }
  }

  const versionExpected = pkgLock.versionOf(dependency)
  if (!versionExpected) {
    return {
      equals: false,
      detail: {
        [dependency.name]: 'Not found in package-lock.json',
      }
    }
  }

  if (versionExpected.startsWith('github:')) {
    return {
      equals: true,
    }
  }

  if (versionExpected === installedVersion) {
    return {
      equals: true,
    }
  } else {
    return {
      equals: false,
      detail: {
        [dependency.name]: `Version not matchs: "${installedVersion}" in node_modues, "${versionExpected}" in package-lock.json`
      }
    }
  }
}

module.exports = {
  readJson,
  readFileAsync,
  readdirAsync,
  isDirAsync,
  compareDependency,
}
