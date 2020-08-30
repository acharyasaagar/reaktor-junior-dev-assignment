const express = require('express')

const cors = require('./cors')
const database = require('../db')
const app = express()

/** Express App Configuration */
app.use(cors)
app.use(express.static('static'))
app.use(express.json())
app.set('view engine', 'pug')
/** ************************* */

app.get('/api/packages', (req, res) => {
  return res.json(database.getAllPackages())
})

app.get('/api/packages/:package', (req, res) => {
  const { package } = req.params
  if (database.exists(package)) {
    return res.json(database.getPackage(package))
  }
  return res.status('404').end()
})

app.get('/:package', (req, res) => {
  const { package } = req.params
  if (database.exists(package)) {
    return res.render('package', { package: database.getPackage(package) })
  }

  return res.render('404')
})

app.patch('/:package', (req, res) => {
  const { package: packageName } = req.params

  if (database.exists(packageName)) {
    const { patch } = req.body
    let package = database.getPackage(packageName)
    switch (patch) {
      case 'note':
        const packageNotes = package.notes
          ? [...package.notes, req.body.data]
          : [req.body.data]
        package.notes = [...packageNotes]
        database.savePackage(package)
        return res.status(200).end()
      /** ******************************** */
      case 'tag':
        const packageTags = package.tags
          ? [...package.tags, req.body.data]
          : [req.body.data]
        package.tags = Array.from(new Set(packageTags))
        const allTagsInDb = database.getAllTags()
        const updatedTags = allTagsInDb[req.body.data]
          ? [...allTagsInDb[req.body.data], packageName]
          : [packageName]
        const dupRemoved = Array.from(new Set(updatedTags))
        allTagsInDb[req.body.data] = dupRemoved
        database.savePackage(package)
        database.updateTags(allTagsInDb)
        return res.status(200).end()
      default:
        return res.status(200).end()
    }
  }
  return res.status(400)
})

app.get('/', (req, res) => {
  const packages = database.getAllPackages()
  const sorted = packages.sort((a, b) => {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  })
  return res.render('index', { packages: sorted })
})
/** Start app */
const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`\nGo to ===> http://localhost:${PORT}\n`))
