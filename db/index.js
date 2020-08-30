const fs = require('fs')
const path = require('path')

const config = { encoding: 'utf-8' }
const tagsJson = path.resolve(__dirname, '../db/tags.json')

const getLocation = package =>
  path.resolve(__dirname, `packages/${package}.json`)

const exists = package => fs.existsSync(getLocation(package))

const getPackage = name => {
  const packagePath = getLocation(name)
  return JSON.parse(fs.readFileSync(packagePath, config))
}

const savePackage = payload => {
  const packagePath = getLocation(payload.name)
  return fs.writeFileSync(packagePath, JSON.stringify(payload))
}

const getAllPackages = () => {
  return getAllPackageNames().map(package => getPackage(package))
}

const getAllPackageNames = () => {
  return fs
    .readdirSync(path.resolve(__dirname, 'packages'))
    .map(name => name.replace('.json', ''))
}

const getAllTags = () => {
  const content = fs.readFileSync(tagsJson, config)
  if (content === '') return {}
  return JSON.parse(content)
}

const updateTags = tags => {
  return fs.writeFileSync(tagsJson, JSON.stringify(tags))
}

module.exports = {
  exists,
  getAllPackages,
  getAllPackageNames,
  getAllTags,
  getPackage,
  savePackage,
  updateTags,
}
