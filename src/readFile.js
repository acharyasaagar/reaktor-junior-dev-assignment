const path = require('path')
const fs = require('fs')

const {
  extractKeysFromPackageChunk,
  extractValuesFromPackageChunk,
  formatDependencies,
  formatReverseDependencies,
} = require('./helpers')

/** Path to file */
const dpkgFilePath = '/var/lib/dpkg/status'
/** Read the file content */
const dpkgFileContent = fs.readFileSync(dpkgFilePath, {
  encoding: 'utf-8',
})

/** Break the file content into different chunks, each chunk representing a package */
const paragraphs = dpkgFileContent.split(/(?:\n{2,})/g).filter(p => p)

/** Create a json file from that chunk and store packages in required model an array */
let data = []
for (let paragraph of paragraphs) {
  const asObject = {}
  const keys = extractKeysFromPackageChunk(paragraph)
  const values = extractValuesFromPackageChunk(paragraph)
  const keysLen = keys.length
  for (let i = 0; i < keysLen; i++) {
    asObject[keys[i]] = values[i]
  }
  const package = {
    name: asObject.Package,
    description: asObject.Description,
    dependencies: formatDependencies(asObject),
    reverseDependencies: formatReverseDependencies(asObject),
  }
  data = data.concat(package)
}

for (let package of data) {
  fs.writeFileSync(
    path.resolve(__dirname, '../db/', `${package.name}.json`),
    JSON.stringify(package)
  )
}
