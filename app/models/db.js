const path = require('path')
var pg = require('pg-promise')()
var config = require(path.join(__dirname, '/../config/', (process.env.NODE_ENV || 'development')))

var db = pg(config.db)

function init () {
  return db.any('SELECT NOW()')
}

module.exports = {
  db: db,
  init: init
}
