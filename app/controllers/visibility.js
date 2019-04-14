var express = require('express')
var router = express.Router()
var db = require(__dirname + '/../models/dbfunctions/visibility')

/**
 * @api {get} /visibility/ Запрос информации о видимостях
 * @apiName GetVisibility
 * @apiGroup Visibility
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 * @apiSuccess {Object[]} info Массив объектов с информацией о каждой вдимости
 * @apiSuccess {Number} info.id Идентификатор видимости
 * @apiSuccess {Number} info.telid Идентификатор телескопа
 * @apiSuccess {Number} info.objid Идентификатор небесного тела
 */
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

/**
 * @api {post} /visibility/sort Запрос сортированной информации о видимостях
 * @apiName PostSortVisibility
 * @apiGroup Visibility
 *
 * @apiParam {String="ID телескопа","ID небесного тела"} sorttype Признак, по которому происходит сортировка
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 * @apiSuccess {Object[]} info Массив объектов с информацией о каждой вдимости
 * @apiSuccess {Number} info.id Идентификатор видимости
 * @apiSuccess {Number} info.telid Идентификатор телескопа
 * @apiSuccess {Number} info.objid Идентификатор небесного тела
 */
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

/**
 * @api {post} /visibility/search Запрос на поиск информации о видимостях
 * @apiName PostSearchVisibility
 * @apiGroup Visibility
 *
 * @apiParam {String="ID телескопа","ID небесного тела"} searchtype Признак, по которому происходит сортировка
 * @apiParam {String} searchtext Текст поискового запроса
	*
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 * @apiSuccess {Object[]} info Массив объектов с информацией о каждой вдимости
 * @apiSuccess {Number} info.id Идентификатор видимости
 * @apiSuccess {Number} info.telid Идентификатор телескопа
 * @apiSuccess {Number} info.objid Идентификатор небесного тела
 */
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

/**
 * @api {get} /visibility/create Запрос формы на создание видимости
 * @apiName GetCreateVisibility
 * @apiGroup Visibility
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 */
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

/**
 * @api {post} /visibility/create Запрос на создание видимости
 * @apiName PostCreateVisibility
 * @apiGroup Visibility
 *
 * @apiParam {Number} telid Идентификатор телескопа
 * @apiParam {Number} objid Идентификатор небесного тела
 *
 * @apiSuccess {String} title Название страницы
 * @apiSuccess {Object} login Только вошедшие в систему пользователи могут получить данную страницу
 * @apiSuccess {String} login.username Имя пользователя
 * @apiSuccess {String="admin","user"} login.role Роль пользователя
 * @apiSuccess {Object[]} info Массив объектов с информацией о каждой вдимости
 * @apiSuccess {Number} info.telid Идентификатор телескопа
 * @apiSuccess {Number} info.objid Идентификатор небесного тела
 */
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

/**
 * @api {get} /visibility/:id/delete Запрос на удаление видимости
 * @apiName GetDeleteVisibility
 * @apiGroup Visibility
 *
 * @apiParam {Number} info.id Идентификатор видимости
 */
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
