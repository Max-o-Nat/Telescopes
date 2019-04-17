const path = require('path')
var express = require('express')
var router = express.Router()
var passport = require(path.join(__dirname, '/../models/passport'))
const jwt = require('jsonwebtoken')
var config = require(path.join(__dirname, '/../config/', (process.env.NODE_ENV || 'development')))

router.get('/',
  (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) { return next(err) }
      if (!user) {
        return res.render('login', { title: 'Вход' })
      }
      res.redirect('/')
    })(req, res)
  }
)

router.post('/',
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
)

module.exports = router
