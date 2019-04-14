var express = require('express')
var router = express.Router()
var db = require(__dirname + '/../models/dbfunctions/visibility')

router.get('/', async (req, res, next) => {
  try {
    var data = await db.visibility()
    res.render('visibility', {
      title: 'Видимость',
      login: req.user,
      info: data
    })
  } catch (err) {
    next(err)
  }
})

router.post('/sort', async (req, res, next) => {
  try {
    var data = await db.sortVisibility()
    res.render('visibility', {
      title: 'Видимость',
      login: req.user,
      info: data
    })
  } catch (err) {
    next(err)
  }
})

router.post('/search', async (req, res, next) => {
  try {
    var data = []
    if (req.body.searchtype === 'ID телескопа') {
      data = await db.telescopeVisibility(req.body.searchtext)
    } else {
      data = await db.objectVisibility(req.body.searchtext)
    }
    res.render('visibility', {
      title: 'Видимость',
      login: req.user,
      searchtext: req.body.searchtext,
      searchtype: req.body.searchtype,
      info: data
    })
  } catch (err) {
    next(err)
  }
})

router.get('/create', [
  async (req, res, next) => {
    try {
      res.render('visibilitycreate', {
        title: 'Добавление видимости',
        login: req.user,
        err: req.errors
      })
    } catch (err) {
      next(err)
    }
  }
])

router.post('/create', [
  async (req, res, next) => {
    try {
      await db.createVisibility([
        req.body.telid,
        req.body.objid
      ])
      res.redirect('/visibility')
    } catch (err) {
      req.errors = [{ msg: err.detail }]
      next()
    }
  },
  async (req, res) => {
    res.render('visibilitycreate', {
      title: 'Добавление видимости',
      login: req.user,
      telid: req.body.telid,
      objid: req.body.objid,
      err: req.errors
    })
  }
])

router.get('/:id/delete', [
  async (req, res, next) => {
    try {
      await db.deleteVisibilityByID(req.params.id)
      res.redirect('/visibility')
    } catch (err) {
      next(err)
    }
  }
])
module.exports = router
