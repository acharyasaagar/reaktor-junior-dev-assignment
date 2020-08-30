const formatDependencies = package => {
  if (!package.Depends) return []
  return package.Depends.split(', ')
    .map(dep => dep.replace(/\s*\(.*\)/, ''))
    .map(pkg => {
      const splitted = pkg.split(/\s\|\s/)
      return {
        name: splitted[0],
        alternates: splitted.slice(1),
      }
    })
}

const formatReverseDependencies = package => {
  if (!package.Breaks) return []
  return package.Breaks.split(', ').map(dep => dep.replace(/\s*\(.*\)/, ''))
}

const extractKeysFromPackageChunk = package => {
  return package
    .match(/(^|\n)[-\w]+:\s/g)
    .map(key => key.replace(/(\n|:\s+)/g, ''))
}

const extractValuesFromPackageChunk = package => {
  return package.split(/(?:^|\n)[-\w]+:\s+/g).filter(item => item)
}

module.exports = {
  extractKeysFromPackageChunk,
  extractValuesFromPackageChunk,
  formatDependencies,
  formatReverseDependencies,
}
