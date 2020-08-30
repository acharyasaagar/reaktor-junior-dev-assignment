const allowedHosts = ['http://localhost:5500', 'http://127.0.0.1:5500']
module.exports = (req, res, next) => {
  const origin = req.get('origin')
  if (allowedHosts.includes(origin)) {
    res.set('Access-Control-Allow-Origin', `${origin}`)
    console.log(res.get('Access-Control-Allow-Origin'))
    return next()
  }
  return next()
}
