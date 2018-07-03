const {join} = require('path')
const {readJson} = require('./helpers')
const PackageLock = require('./PackageLock')

async function needsPkgInstall (path) {
  const pkgLockJson = await readJson(join(path, 'package-lock.json'))

  const pkgLock = new PackageLock(pkgLockJson)

  for (const dependency of pkgLock.allDependencies) {
    const versionShouldBe = pkgLock.versionOf(dependency)
    if (versionShouldBe.startsWith('github:')) {
      continue
    }
    const installedVersion = (await readJson(join(path, dependency.pkgJsonFilePath))).version
    if (versionShouldBe !== installedVersion) {
      return true
    }
  }
}

module.exports = needsPkgInstall
