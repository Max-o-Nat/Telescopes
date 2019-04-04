const express = require('express')
const createError = require('http-errors')
const path = require('path')
const morgan = require('morgan')

const db = require(__dirname+'/models/db')

const config = require(__dirname + '/config/' + (process.env.NODE_ENV || 'development'))

const indexRouter = require(__dirname+'/controllers/index')
const objectsRouter = require(__dirname+'/controllers/objects')

const app = express()

app.use(morgan('combined'))

app.use(express.static(path.join(__dirname, '/../public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', indexRouter)
app.use('/objects', objectsRouter)

app.use(function(req, res, next) {
	next(createError(404))
})

app.use(function(err, req, res, next) {
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	res.status(err.status || 500)
	res.render('error')
})

module.exports = app