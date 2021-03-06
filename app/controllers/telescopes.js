var express = require('express')
const path = require('path')
var router = express.Router()
var db = require(path.join(__dirname, '/../models/dbfunctions/telescopes'))

/**
 * @api {get} /telescopes/create Запрос формы на создание телескопа
 * @apiName GetСreateTelescopes
 * @apiGroup Telescopes
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 */
router.get('/create', [
  async (req, res, next) => {
    try {
      res.render('telescopecreate', {
        title: 'Добавление телескопа',
        login: req.user,
        err: req.errors
      })
    } catch (err) {
      next(err)
    }
  }
])

/**
 * @api {post} /telescopes/create Запрос на создание телескопа
 * @apiName PostСreateTelescopes
 * @apiGroup Telescopes
 *
 * @apiParam {String} name Название телескопа
 * @apiParam {String="рефлектор","рефрактор","катадиоптрический"} type Тип телескопа
 * @apiParam {String} country Страна телескопа
 * @apiParam {String} city Город телескопа
 * @apiParam {String} info Дополнительная информация о телескопе
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 * @apiSuccess {Object[]} info Массив объектов с информацией о каждом телескопе
 * @apiSuccess {Number} info.id Идентификатор телескопа
 * @apiSuccess {String} info.name Название телескопа
 * @apiSuccess {String="рефлектор","рефрактор","катадиоптрический"} info.type Тип телескопа
 * @apiSuccess {String} info.country Страна телескопа
 * @apiSuccess {String} info.city Город телескопа
 * @apiSuccess {String} info.info Дополнительная информация о телескопе
 */
router.post('/create', [
  async (req, res, next) => {
    req.errors = []
    if (!req.body.name) {
      req.errors.push({ msg: 'Введите название телескопа.' })
    }
    if (!req.body.telcountry) {
      req.errors.push({ msg: 'Введите город.' })
    }
    if (!req.body.telcity) {
      req.errors.push({ msg: 'Введите страну.' })
    }
    if (req.errors.length) {
      return next()
    }
    try {
      await db.createTelescope(
        req.body.name,
        req.body.type,
        req.body.telinfo,
        req.body.telcity,
        req.body.telcountry
      )
      res.redirect('/')
    } catch (err) {
      next(err)
    }
  },
  async (req, res, next) => {
    try {
      res.render('telescopecreate', {
        title: 'Добавление телескопа',
        login: req.user,
        name: req.body.name,
        type: req.body.type,
        telinfo: req.body.telinfo,
        telcity: req.body.telcity,
        telcountry: req.body.telcountry,
        err: req.errors
      })
    } catch (err) {
      next(err)
    }
  }
])

/**
 * @api {get} /telescopes/:id Запрос телескопа
 * @apiName GetIdTelescopes
 * @apiGroup Telescopes
 *
 * @apiParam {Number} id Идентификатор телескопа
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 * @apiSuccess {Object[]} info Массив объектов с информацией о каждом телескопе
 * @apiSuccess {Number} info.id Идентификатор телескопа
 * @apiSuccess {String} info.name Название телескопа
 * @apiSuccess {String="рефлектор","рефрактор","катадиоптрический"} info.type Тип телескопа
 * @apiSuccess {String} info.country Страна телескопа
 * @apiSuccess {String} info.city Город телескопа
 * @apiSuccess {String} info.info Дополнительная информация о телескопе
 */
router.get('/:id', [
  async (req, res, next) => {
    try {
      var data = await db.telescopeByID(req.params.id)
      res.render('telescopeinfo', {
        title: 'Обзор телесокопа',
        login: req.user,
        info: data,
        err: req.errors
      })
    } catch (err) {
      next(err)
    }
  }
])

/**
 * @api {get} /telescopes/:id/change Запрос формы на изменение телескопа
 * @apiName GetIdChangeTelescopes
 * @apiGroup Telescopes
 *
 * @apiParam {Number} id Идентификатор телескопа
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 * @apiSuccess {Object[]} info Массив объектов с информацией о каждом телескопе
 * @apiSuccess {Number} info.id Идентификатор телескопа
 * @apiSuccess {String} info.name Название телескопа
 * @apiSuccess {String="рефлектор","рефрактор","катадиоптрический"} info.type Тип телескопа
 * @apiSuccess {String} info.country Страна телескопа
 * @apiSuccess {String} info.city Город телескопа
 * @apiSuccess {String} info.info Дополнительная информация о телескопе
 */
router.get('/:id/change', [
  async (req, res, next) => {
    try {
      var data = await db.telescopeByID(req.params.id)
      res.render('telescopeform', {
        title: 'Обзор телесокопа',
        login: req.user,
        info: data,
        err: req.errors
      })
    } catch (err) {
      next(err)
    }
  }
])

/**
 * @api {post} /telescopes/:id/change Запрос формы на изменение телескопа
 * @apiName PostIdChangeTelescopes
 * @apiGroup Telescopes
 *
 * @apiParam {Number} id Идентификатор телескопа
 * @apiParam {String} name Название телескопа
 * @apiParam {String="рефлектор","рефрактор","катадиоптрический"} type Тип телескопа
 * @apiParam {String} country Страна телескопа
 * @apiParam {String} city Город телескопа
 * @apiParam {String} info Дополнительная информация о телескопе
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 * @apiSuccess {Object[]} info Массив объектов с информацией о каждом телескопе
 * @apiSuccess {Number} info.id Идентификатор телескопа
 * @apiSuccess {String} info.name Название телескопа
 * @apiSuccess {String="рефлектор","рефрактор","катадиоптрический"} info.type Тип телескопа
 * @apiSuccess {String} info.country Страна телескопа
 * @apiSuccess {String} info.city Город телескопа
 * @apiSuccess {String} info.info Дополнительная информация о телескопе
 */
router.post('/:id/change', [
  async (req, res, next) => {
    try {
      await db.changeTelescope(
        req.params.id,
        req.body.name,
        req.body.type,
        req.body.telinfo,
        req.body.telcity,
        req.body.telcountry
      )
      res.redirect('/telescopes/' + req.params.id + '/change')
    } catch (err) {
      next(err)
    }
  },
  async (req, res, next) => {
    try {
      var data = await db.telescopeByID(req.params.id)
      res.render('telescopeform', {
        title: 'Обзор телесокопа',
        login: req.user,
        info: data,
        err: req.errors
      })
    } catch (err) {
      next(err)
    }
  }
])

/**
 * @api {get} /telescopes/:id/delete Запрос на удаление телескопа
 * @apiName GetIdDeleteTelescopes
 * @apiGroup Telescopes
 *
 * @apiParam {Number} id Идентификатор телескопа
 */
router.get('/:id/delete', [
  async (req, res, next) => {
    try {
      await db.deleteTelescopeByID(req.params.id)
      res.redirect('/')
    } catch (err) {
      next(err)
    }
  }
])
module.exports = router
