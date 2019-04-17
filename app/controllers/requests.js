const path = require('path')
var express = require('express')
var router = express.Router()
var db = require(path.join(__dirname, '/../models/dbfunctions/requests'))
var dbx = require(path.join(__dirname, '/../models/dropbox'))
var config = require(path.join(__dirname, '/../config/', (process.env.NODE_ENV || 'development')))
var multer = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })
var { body, validationResult } = require('express-validator/check')
var { sanitizeBody } = require('express-validator/filter')
var passport = require(path.join(__dirname, '/../models/passport'))
var rwlock = require('rwlock')
var lock = new rwlock()
var lockflag = []

router.get('/', async (req, res, next) => {
  try {
    if (req.user.role == 'admin') { var data = await db.requests() } else { var data = await db.userRequests(req.user.username) }

    res.render('requests', {
      title: 'Запросы',
      login: req.user,
      info: data
    })
  } catch (err) {
    next(err)
  }
})

router.get('/create', async (req, res, next) => {
  try {
    var data = await db.requestTelescopes()
  } catch (err) {
    next(err)
  }
  res.render('requestcreate', {
    title: 'Создание запроса',
    telescopes: data,
    login: req.user
  })
})

router.post('/create', [
  async (req, res, next) => {
    try {
      var telid = parseInt(req.body.telname)
      var objects = await db.telescopeVisibility(telid)
    } catch (err) {
      next(err)
    }
    if (objects && (objects.length == 0)) {
      try {
        var data = await db.requestTelescopes()
      } catch (err) {
        next(err)
      }
      res.render('requestcreate', {
        title: 'Создание запроса',
        telescopes: data,
        login: req.user,
        err: [{ msg: 'У данного телескопа нет доступных небесных тел, выберите другой.' } ]
      })
    } else {
      res.render('requestcreate1', {
        title: 'Создание запроса',
        telid: telid,
        objects: objects,
        login: req.user
      })
    }
  }
])

router.post('/create/:telid', [
  async (req, res, next) => {
    try {
      await db.createRequest(
        req.user.username,
        req.params.telid,
        req.body.objname
      )
      res.redirect('/requests')
    } catch (err) {
      next(err)
    }
  }
])

router.get('/:id/update', [
  async (req, res, next) => {
    try {
      lock.readLock(function (release) {
        if ((lockflag[req.params.id]) && (lockflag[req.params.id] != req.user.username)) { res.redirect('/requests') } else {
          lockflag[req.params.id] = req.user.username
          try {
            res.render('requestupdate', {
              title: 'Выполнение запроса',
              login: req.user,
              rid: req.params.id,
              err: req.errors
            })
          } catch (err) {
            next(err)
          }

          release()
        }
      })
    } catch (err) {
      next(err)
    }
  }
])

router.post('/:id/update', [
  upload.single('photo'),
  async (req, res, next) => {
    if (!req.file) {
      return res.render('requestupdate', {
        title: 'Выполнение запроса',
        login: req.user,
        rid: req.params.id,
        err: [ { msg: 'Не выбран файл' } ]
      })
    } else {
      try {
        var r = await dbx.uploadphoto(req.file, req.params.id)
      } catch (err) {
        next(err)
      }
      try {
        await db.createAstrophoto(req.params.id, r.name)
        res.redirect('/requests')
      } catch (err) {
        next(err)
      }
      lockflag[req.params.id] = undefined
    }
  }
])

router.get('/:id/delete', [
  async (req, res, next) => {
    try {
      await db.deleteRequestByID(req.params.id)
      res.redirect('/requests')
    } catch (err) {
      next(err)
    }
  }
])
module.exports = router
