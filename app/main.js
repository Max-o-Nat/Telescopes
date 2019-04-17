const express = require('express')
const createError = require('http-errors')
const path = require('path')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

const passport = require(path.join(__dirname, '/models/passport'))

const indexRouter = require(path.join(__dirname, '/controllers/index'))
const usersRouter = require(path.join(__dirname, '/controllers/users'))
const objectsRouter = require(path.join(__dirname, '/controllers/objects'))
const visibilityRouter = require(path.join(__dirname, '/controllers/visibility'))
const loginRouter = require(path.join(__dirname, '/controllers/login'))
const requestsRouter = require(__dirname + '/controllers/requests')
const registrationRouter = require(path.join(__dirname, '/controllers/registration'))

const app = express()

app.use(morgan('combined'))

app.use(express.static(path.join(__dirname, '/../public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/registration', registrationRouter)
app.use('/login', loginRouter)
app.use(passport.authenticate('jwt', { session: false, failureRedirect: '/login' }))
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/objects', objectsRouter)
app.use('/requests', requestsRouter)
app.use('/visibility', [
  async (req, res, next) => {
    if (req.user.role !== 'admin') { res.redirect('/') } else { next() }
  },
  visibilityRouter
])

app.get('/logout', function (req, res) {
  req.logout()
  res.cookie('jwt', '0')
  res.redirect('/login')
})

app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
