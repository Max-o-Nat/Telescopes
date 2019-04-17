const path = require('path')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy

var db = require(path.join(__dirname, '/db')).db

var config = require(path.join(__dirname, '/../config/', (process.env.NODE_ENV || 'development')))

passport.use(new LocalStrategy(
  async (username, password, done) => {
    if ((password.length < 6) || (password.length > 30)) {
      return done(null, false, {
        msg: 'Пароль должен содержать не менее 6 символов и не более 30.'
      })
    }
    try {
      var data = await db.func('CheckUser', [username, password])
      if (data[0].checkuser === null) {
        return done(null, false, {
          msg: 'Такого пользователя не существует и/или неверный пароль'
        })
      } else {
        return done(null, { username: username, role: data[0].checkuser })
      }
    } catch (error) {
      return done(error)
    }
  }
))

const jwtOptions = {
  jwtFromRequest: (req) => {
    var token = null
    if (req && req.cookies) { token = req.cookies['jwt'] }
    return token
  },
  secretOrKey: config.secret,
  jsonWebTokenOptions: { expiresIn: 2 }
}

passport.use(new JwtStrategy(
  jwtOptions,
  (payload, done) => {
    return done(null, payload)
  })
)

module.exports = passport
