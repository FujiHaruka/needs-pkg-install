const {join} = require('path')
const {readJson, compareDependency} = require('./helpers')
const PackageLock = require('./PackageLock')
const NodeModules = require('./NodeModules')

/**
 * Teach the project needs `npm install` or not.
 * @param {String} path - project path
 * @param {Object} [options]
 * @param {Boolean} [options.verbose=false]
 * @param {Array<String>} [options.ignore=[]]
 * @returns {Promise<Boolean>}
 */
async function needsPkgInstall (path, options = {}) {
  const {
    ignore = [],
    verbose = false,
  } = options

  const pkgLockJson = await readJson(join(path, 'package-lock.json'))
  const pkgLock = new PackageLock(pkgLockJson)
  const nodeModules = new NodeModules(path, ignore)
  await nodeModules.load()

  const comparedResult = {
    needs: false,
    detail: {},
  }

  // package-lock.json にあるモジュールが node_modules にあるか
  for (const dependency of pkgLock.allDependencies) {
    const {equals, detail} = await compareDependency({
      dependency,
      nodeModules,
      pkgLock,
    })
    if (verbose) {
      if (!equals) {
        comparedResult.needs = true
      }
      if (detail) {
        Object.assign(comparedResult.detail, detail)
      }
    } else {
      if (!equals) {
        return true
      }
    }
  }

  return verbose ? comparedResult : false
}

module.exports = needsPkgInstall
