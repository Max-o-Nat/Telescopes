var express = require('express')
const path = require('path')
var router = express.Router()
var db = require(path.join(__dirname, '/../models/dbfunctions/objects'))

/**
 * @api {get} /objects Запрос информации о небесных телах
 * @apiName GetObjects
 * @apiGroup Objects
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 * @apiSuccess {Object[]} info Массив объектов с информацией о каждом небесном теле
 * @apiSuccess {Number} info.id Идентификатор небесного тела
 * @apiSuccess {String} info.name Название небесного тела
 */
router.get('/', async (req, res, next) => {
	try {
		var data = await db.objects()
		res.render('objects', {
			title: 'Доступные небесные тела',
			login: req.user ? req.user : {},
			info: data
		})
	} catch (err) {
		next(err)
	}
})

/**
 * @api {post} /objects/sort Запрос отсортированной информации о небесных телах
 * @apiName PostSortObjects
 * @apiGroup Objects
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 * @apiSuccess {Object[]} info Массив объектов с информацией о каждом небесном теле
 * @apiSuccess {Number} info.id Идентификатор небесного тела
 * @apiSuccess {String} info.name Название небесного тела
 */
router.post('/sort', async (req, res, next) => {
	try {
		var data = await db.sortObjects()
		res.render('objects', {
			title: 'Доступные небесные тела',
			login: req.user,
			info: data
		})
	} catch (err) {
		next(err)
	}
})

/**
 * @api {post} /objects/search Запрос на поиск небесных тел
 * @apiName PostSearchObjects
 * @apiGroup Objects
 *
 * @apiParam {String} searchtext Текст поискового запроса
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 * @apiSuccess {Object[]} info Массив объектов с информацией о каждом небесном теле
 * @apiSuccess {Number} info.id Идентификатор небесного тела
 * @apiSuccess {String} info.name Название небесного тела
 */
router.post('/search', [
  async (req, res, next) => {
    try {
      var searchtype = req.body.searchtype ? req.body.searchtype : 'Название небесного тела'
      if ((searchtype === 'ID небесного тела') && (isNaN(parseInt(req.body.searchtext)) || (parseInt(req.body.searchtext) <= 0))) {
        res.render('objects', {
          title: 'Доступные небесные тела',
          login: req.user,
          info: [],
          err: [{ msg: 'Введите целое положительное число.' }]
        })
      } else {
        var data = await db.searchObjects(searchtype, req.body.searchtext)
        res.render('objects', {
          title: 'Доступные небесные тела',
          login: req.user,
          info: data
        })
      }
    } catch (err) {
      next(err)
    }
  }
])

/**
 * @api {get} /objects/create Запрос формы на создание небесного тела
 * @apiName GetCreateObjects
 * @apiGroup Objects
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 */
router.get('/create', [
	async (req, res, next) => {
		try {
			res.render('objectcreate', {
				title: 'Добавление небесного тела',
				login: req.user,
				err: req.errors
			})
		} catch (err) {
			next(err)
		}
	}
])

/**
 * @api {post} /objects/create Запрос на создание небесного тела
 * @apiName PostCreateObjects
 * @apiGroup Objects
 *
 * @apiParam {String} objname Название небесного тела
 * @apiParam {Number} objh Координата h небесного тела
 * @apiParam {Number} obja Координата a небесного тела
 * @apiParam {String} objinfo Дополнительная информация о небесном теле
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 * @apiSuccess {String} objname Название небесного тела
 * @apiSuccess {Number} objh Координата h небесного тела
 * @apiSuccess {Number} obja Координата a небесного тела
 * @apiSuccess {String} objinfo Дополнительная информация о небесном теле
 */
router.post('/create', [
	async (req, res, next) => {
		try {
			if (req.body.objname === '') {
				req.errors = [{msg: 'Введите название.'}]
				return next()
			}
			await db.createObject(
				req.body.objname,
				req.body.objh,
				req.body.obja,
				req.body.objinfo
			)
			res.redirect('/objects')
		} catch (err) {
			req.errors = [{msg: err.detail}]
			next()
		}
	},
	(req, res) => {
		res.render('objectcreate', {
			title: 'Добавление небесного тела',
			login: req.user,
			objname: req.body.objname,
			objh: req.body.objh,
			obja: req.body.obja,
			objinfo: req.body.objinfo,
			err: req.errors
		})
	}
])

/**
 * @api {get} /objects/:id Запрос небесного тела
 * @apiName GetIdObjects
 * @apiGroup Objects
 *
 * @apiParam {Number} id Идентификатор небесного тела.
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 * @apiSuccess {Object[]} info Массив объектов с информацией о каждом небесном теле
 * @apiSuccess {Number} info.id Идентификатор небесного тела.
 * @apiSuccess {String} info.objname Название небесного тела
 * @apiSuccess {Number} info.objh Координата h небесного тела
 * @apiSuccess {Number} info.obja Координата a небесного тела
 * @apiSuccess {String} info.objinfo Дополнительная информация о небесном теле
 */
router.get('/:id', [
	async (req, res, next) => {
		try {
			var data = await db.objectByID(req.params.id)
			res.render('objectinfo', {
				title: 'Обзор небесного тела',
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
 * @api {get} /objects/:id/change Запрос формы на изменение небесного тела
 * @apiName GetIdObjects
 * @apiGroup Objects
 *
 * @apiParam {Number} id Идентификатор небесного тела
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 * @apiSuccess {Object[]} info Массив объектов с информацией о каждом небесном теле
 * @apiSuccess {Number} info.id Идентификатор небесного тела
 * @apiSuccess {String} info.objname Название небесного тела
 * @apiSuccess {Number} info.objh Координата h небесного тела
 * @apiSuccess {Number} info.obja Координата a небесного тела
 * @apiSuccess {String} info.objinfo Дополнительная информация о небесном теле
 */
router.get('/:id/change', [
	async (req, res, next) => {
		try {
			var data = await db.objectByID(req.params.id)
			res.render('objectform', {
				title: 'Изменение небесного тела',
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
 * @api {post} /objects/:id/change Запрос на изменение небесного тела
 * @apiName PostIdObjects
 * @apiGroup Objects
 *
 * @apiParam {Number} id Идентификатор небесного тела
 * @apiParam {String} objname Название небесного тела
 * @apiParam {Number} objh Координата h небесного тела
 * @apiParam {Number} obja Координата a небесного тела
 * @apiParam {String} objinfo Дополнительная информация о небесном теле
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 * @apiSuccess {Object[]} info Массив объектов с информацией о каждом небесном теле
 * @apiSuccess {Number} info.id Идентификатор небесного тела.
 * @apiSuccess {String} info.objname Название небесного тела
 * @apiSuccess {Number} info.objh Координата h небесного тела
 * @apiSuccess {Number} info.obja Координата a небесного тела
 * @apiSuccess {String} info.objinfo Дополнительная информация о небесном теле
 */
router.post('/:id/change', [
	async (req, res, next) => {
		try {
			if (req.body.objname === '') {
				req.errors = [{msg: 'Введите название.'}]
				return next()
			}
			await db.changeObject(
				req.params.id,
				req.body.objname,
				req.body.objh,
				req.body.obja,
				req.body.objinfo
			)
			res.redirect('/objects/' + req.params.id + '/change')
		} catch (err) {
			req.errors = [{msg: err.detail}]
			next()
		}
	},
	async (req, res, next) => {
		try {
			var data = await db.objectByID(req.params.id)
			res.render('objectform', {
				title: 'Изменение небесного тела',
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
 * @api {get} /objects/:id/delete Запрос на удаление небесного тела
 * @apiName GetIdDeleteObjects
 * @apiGroup Objects
 *
 * @apiParam {Number} id Идентификатор небесного тела
 */
router.get('/:id/delete', [
	async (req, res, next) => {
		try {
			await db.deleteObjectByID(req.params.id)
			res.redirect('/objects')
		} catch (err) {
			next(err)
		}
	}
])

module.exports = router
