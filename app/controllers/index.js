var express = require('express')
const path = require('path')
var router = express.Router()
var db = require(path.join(__dirname, '/../models/dbfunctions/telescopes'))
var { sanitizeBody } = require('express-validator/filter')

/**
 * @api {get} / Запрос информации о телескопах
 * @apiName GetIndex
 * @apiGroup Index
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
router.get('/', async (req, res, next) => {
  try {
    var data = await db.telescopes()
    res.render('index', {
      title: 'Доступные телескопы',
      login: req.user,
      info: data
    })
  } catch (err) {
    next(err)
  }
})

/**
 * @api {post} /sort Запрос отсортированной информации о телескопах
 * @apiName PostSortIndex
 * @apiGroup Index
 *
 * @apiParam {String="Страна","Город","Тип телескопа"} sorttype Признак, по которому происходит сортировка 
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 * @apiSuccess {Object[]} info Отсортированный массив объектов с информацией о каждом телескопе
 * @apiSuccess {Number} info.id Идентификатор телескопа
 * @apiSuccess {String} info.name Название телескопа
 * @apiSuccess {String="рефлектор","рефрактор","катадиоптрический"} info.type Тип телескопа
 * @apiSuccess {String} info.country Страна телескопа
 * @apiSuccess {String} info.city Город телескопа
 * @apiSuccess {String} info.info Дополнительная информация о телескопе
 */
router.post('/sort', async (req, res, next) => {
  try {
    var data = await db.sortTelescopes(req.body.sorttype)
    res.render('index', {
      title: 'Доступные телескопы',
      login: req.user,
      info: data
    })
  } catch (err) {
    next(err)
  }
})

/**
 * @api {post} /search Запрос на поиск телескопов
 * @apiName PostSearchIndex
 * @apiGroup Index
 *
 * @apiParam {String="Страна","Город"} searchtype Признак, по которому происходит поиск
 * @apiParam {String} searchtext Текст поискового запроса
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 * @apiSuccess {Object[]} info Отсортированный массив объектов с информацией о каждом телескопе
 * @apiSuccess {Number} info.id Идентификатор телескопа
 * @apiSuccess {String} info.name Название телескопа
 * @apiSuccess {String="рефлектор","рефрактор","катадиоптрический"} info.type Тип телескопа
 * @apiSuccess {String} info.country Страна телескопа
 * @apiSuccess {String} info.city Город телескопа
 * @apiSuccess {String} info.info Дополнительная информация о телескопе
 */
router.post('/search', [
  sanitizeBody('searchtext').trim().escape(),
  async (req, res, next) => {
    try {
      var data = await db.searchTelescopes(req.body.searchtype,
        req.body.searchtext)
      res.render('index', {
        title: 'Доступные телескопы',
        login: req.user,
        info: data
      })
    } catch (err) {
      next(err)
    }
  }
])

module.exports = router
