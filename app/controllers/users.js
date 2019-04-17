const path = require('path')
var express = require('express')
var router = express.Router()
var db = require(path.join(__dirname, '/../models/dbfunctions/users'))
var dbx = require(path.join(__dirname, '/../models/dropbox'))
var config = require(path.join(__dirname, '/../config/', (process.env.NODE_ENV || 'development')))
var multer = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })
var { body, validationResult } = require('express-validator/check')
var { sanitizeBody } = require('express-validator/filter')
const jwt = require('jsonwebtoken')

router.get('/', [
  (req, res, next) => {
    if (req.user.role === 'admin') { next() } else { res.redirect('/users/profile') }
  },
  async (req, res, next) => {
    try {
      var data = await db.users()
      res.render('users', {
        title: 'Пользователи',
        login: req.user,
        info: data
      })
    } catch (err) {
      next(err)
    }
  }
])

router.post('/sort', [
  async (req, res, next) => {
    try {
      var data = await db.sortUsers(req.body.sorttype)
      res.render('users', {
        title: 'Пользователи',
        sorttype: req.body.sorttype,
        login: req.user,
        info: data
      })
    } catch (err) {
      next(err)
    }
  }
])

router.post('/search', [
  async (req, res, next) => {
    try {
      if ((req.body.searchtype === 'ID') &&
          (isNaN(parseInt(req.body.searchtext)) ||
          (parseInt(req.body.searchtext) <= 0))) {
        res.render('users', {
          title: 'Пользователи',
          searchtype: req.body.searchtype,
          searchtext: req.body.searchtext,
          login: req.user,
          info: [],
          err: [{ msg: 'Введите целое положительное число.' }]
        })
      } else {
        var data = await db.searchUsers(
          req.body.searchtype,
          req.body.searchtext
        )
        res.render('users', {
          title: 'Пользователи',
          searchtype: req.body.searchtype,
          searchtext: req.body.searchtext,
          login: req.user,
          info: data
        })
      }
    } catch (err) {
      next(err)
    }
  }
])

router.get('/profile', [
  async (req, res, next) => {
    try {
      var data = await db.userByLogin(req.user.username)
      data[0].avatar = await dbx.getLink(data[0].avatar)
      var paths = await db.getUserPhotos(data[0].userid)
      var imgs = await getPaths(paths)
      res.render('userprofile', {
        title: 'Профиль',
        login: req.user,
        info: data,
        imgs: imgs
      })
    } catch (err) {
      return next(err)
    }
  }
])

router.post('/profile/changeavatar', [
  upload.single('avatar'),
  async (req, res, next) => {
    if (!req.file) {
      try {
        const data = await db.userByLogin(req.user.username)
        data[0].avatar = await dbx.getLink(data[0].avatar)
        var paths = await db.getUserPhotos(data[0].userid)
        var imgs = await getPaths(paths)
        res.render('userprofile', {
          title: 'Профиль',
          login: req.user,
          info: data,
          imgs: imgs,
          err: [ { msg: 'Не выбран файл' } ]
        })
      } catch (err) {
        return next(err)
      }
    } else {
      try {
        const data = await db.userByLogin(req.user.username)
        if (data[0].avatar !== config.defaultuseravatar) { await dbx.delete(data[0].avatar) }

        var r = await dbx.upload(req.file, data[0].userid)
        await db.changeAvatar(data[0].userid, r.name)
        res.redirect('/users/profile')
      } catch (err) {
        return next(err)
      }
    }
  }
])

router.post('/profile/change', [
  body('username', 'Необходимо ввести логин').isLength({ min: 1 }).trim(),
  body('password', 'Необходимо ввести пароль не менее 6 символов и не более 30').isLength({ min: 6, max: 30 }).trim(),
  body('email', 'Необходимо ввести email').isEmail().trim(),
  sanitizeBody('username').trim().escape(),
  sanitizeBody('password').trim().escape(),
  sanitizeBody('email').trim().escape(),
  async (req, res, next) => {
    var errors = validationResult(req).array()
    if (errors.length) {
      try {
        const data = await db.userByLogin(req.user.username)
        data[0].avatar = await dbx.getLink(data[0].avatar)
        const paths = await db.getUserPhotos(data[0].userid)
        const imgs = await getPaths(paths)
        return res.render('userprofile', {
          title: 'Профиль',
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          userinfo: req.body.info,
          imgs: imgs,
          login: req.user,
          info: data,
          errors: errors
        })
      } catch (err) {
        return next(err)
      }
    }
    var d = await db.userByLogin(req.user.username)
    if (d[0].login !== req.body.username) {
      try {
        const u = await db.checkUser(req.body.username)
        if (u) { errors.push(u) }
      } catch (err) {
        next(err)
        return
      }
    }
    if (d[0].email !== req.body.email) {
      try {
        const u = await db.checkEmail(req.body.email)
        if (u) { errors.push(u) }
      } catch (err) {
        next(err)
        return
      }
    }

    if (errors.length) {
      try {
        const data = await db.userByLogin(req.user.username)
        data[0].avatar = await dbx.getLink(data[0].avatar)
        var paths = await db.getUserPhotos(data[0].userid)
        var imgs = await getPaths(paths)
        res.render('userprofile', {
          title: 'Профиль',
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          userinfo: req.body.info,
          imgs: imgs,
          login: req.user,
          info: data,
          errors: errors
        })
        return
      } catch (err) {
        next(err)
      }
    } else {
      try {
        const d = await db.userByLogin(req.user.username)
        await db.changeUser(d[0].userid, req.body.username, req.body.email, req.body.password, req.body.info)
        req.user.username = req.body.username
        if ((d[0].username !== req.body.username) || (d[0].password !== req.body.password)) {
          const token = jwt.sign({ username: req.body.username, role: req.user.role }, config.secret)
          res.cookie('jwt', token)
        }
        res.redirect('/users/profile')
      } catch (err) {
        next(err)
      }
    }
  }
])

router.post('/changerole/:id', [
  (req, res, next) => {
    if (req.user.role === 'admin') { next() } else { res.redirect('/users/profile') }
  },
  async (req, res, next) => {
    try {
      await db.changeRole(req.params.id, req.body.role)
      res.redirect('/users/profile/' + req.params.id)
    } catch (err) {
      next(err)
    }
  }
])

router.get('/profile/:id', [
  (req, res, next) => {
    if (req.user.role === 'admin') { next() } else { res.redirect('/users/profile') }
  },
  async (req, res, next) => {
    try {
      var data = await db.userById(req.params.id)
      data[0].avatar = await dbx.getLink(data[0].avatar)
      var paths = await db.getUserPhotos(data[0].userid)
      var imgs = await getPaths(paths)
      res.render('userprofile', {
        title: 'Профиль',
        login: req.user,
        info: data,
        imgs: imgs
      })
    } catch (err) {
      next(err)
    }
  }
])

async function getPaths (data) {
  var promises = []
  for (var i = data.length - 1; i >= 0; i--) {
    promises.push(dbx.getLink(data[i].path))
  }
  return Promise.all(promises)
}

module.exports = router
