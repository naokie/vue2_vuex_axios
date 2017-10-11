require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var data = [
  {"id":1, "name":"Project 1", "assignedTo":"Matt B", "priority": "High", "completed": false},
  {"id":2, "name":"Project 2", "assignedTo":"Matt B", "priority": "Medium", "completed": true},
  {"id":3, "name":"Project 3", "assignedTo":"Matt B", "priority": "Low", "completed": false}
]
app.get('/secured/projects', (req, res) => {
  res.status(200).json(data)
})

app.post('/secured/projects', (req, res) => {
  var lastProject = data.reduce((prev, current) => (prev.id > current.id) ? prev : current)
  var newId = lastProject.id + 1
  var project = {
    "id": newId,
    "name": "Project " + newId,
    "assignedTo": "Someone Else",
    "priority": "Medium",
    "completed": false
  }
  data.push(project)
  res.status(200).json(project)
})

app.put('/secured/projects/:id', (req, res) => {
  let project = data.filter(p => p.id == req.params.id)
  if (project.length > 0) {
    project[0].completed = !project[0].completed
    res.status(201).json(project[0])
  } else {
    res.sendStatus(404)
  }
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
