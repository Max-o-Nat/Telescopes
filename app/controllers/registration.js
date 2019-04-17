var express = require('express')
var router = express.Router()
const path = require('path')
var db = require(path.join(__dirname, '/../models/dbfunctions/users'))
var { body, validationResult } = require('express-validator/check')
var { sanitizeBody } = require('express-validator/filter')
var passport = require(path.join(__dirname, '/../models/passport'))
const jwt = require('jsonwebtoken')
var config = require(path.join(__dirname, '/../config/', (process.env.NODE_ENV || 'development')))

router.get('/', (req, res, next) => {
  res.render('registration', {
    title: 'Регистрация'
  })
})

router.post('/', [
  body('username', 'Необходимо ввести логин').isLength({ min: 1 }).trim(),
  body('password', 'Необходимо ввести пароль не менее 6 символов и не более 30').isLength({ min: 6, max: 30 }).trim(),
  body('repeatpassword', 'Необходимо повторить пароль не менее 6 символов и не более 30').isLength({ min: 6, max: 30 }).trim(),
  body('email', 'Необходимо ввести email').isEmail().trim(),
  sanitizeBody('username').trim().escape(),
  sanitizeBody('password').trim().escape(),
  sanitizeBody('repeatpassword').trim().escape(),
  sanitizeBody('email').trim().escape(),
  async (req, res, next) => {
    var errors = validationResult(req).array()
    if (errors.length) {
      res.render('registration', {
        title: 'Регистрация',
        username: req.body.username,
        email: req.body.email,
        errors: errors })
    }
    if (req.body.password !== req.body.repeatpassword) {
      errors.push({ msg: 'Пароли не совпадают' })
    }

    try {
      const data = await Promise.all([
        db.checkUser(req.body.username),
        db.checkEmail(req.body.email)
      ])
      if (data[0]) { errors.push(data[0]) }
      if (data[1]) { errors.push(data[1]) }
    } catch (err) {
      return next(err)
    }

    if (errors.length) {
      res.render('registration', {
        title: 'Регистрация',
        username: req.body.username,
        email: req.body.email,
        errors: errors })
    } else {
      try {
        await db.createUser(
          req.body.email,
          req.body.username,
          req.body.password
        )
        next()
      } catch (err) {
        next(err)
      }
    }
  },
  (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      const payload = {
        username: user.username,
        role: user.role
      }
      if (err) { return next(err) }
      if (!user) {
        return res.render('login', { title: 'Вход', errors: [info] })
      }
      const token = jwt.sign(payload, config.secret)
      res.cookie('jwt', token)
      res.redirect('/')
    })(req, res)
  }
])

module.exports = router
