var express = require('express');
var router = express.Router();
var db = require(__dirname + '/../models/dbfunctions/objects');

router.get('/', async (req, res, next) => {
	try {
		var data = await db.objects();
		res.render('objects', {
			title : 'Доступные небесные тела',
			login : req.user ? req.user : {},
			info : data
		});
	} catch (err) {
		next(err);
	}
});

router.post('/sort', async (req, res, next) => {
	try {
		var data = await db.sortObjects();
		res.render('objects', {
			title : 'Доступные небесные тела',
			login : req.user,
			info : data
		});
	} catch (err) {
		next(err);
	}
});

router.post('/search', [
	async (req, res, next) => {
		try {
			var searchtype = req.body.searchtype ? req.body.searchtype : 'Название небесного тела';
			if ((searchtype === 'ID небесного тела') &&
				(isNaN(parseInt(req.body.searchtext))
					|| (parseInt(req.body.searchtext) <= 0))) {
				res.render('objects', {
					title : 'Доступные небесные тела',
					login : req.user,
					info : [],
					err : [{msg : 'Введите целое положительное число.'}]
				});
			} else {
				var data = await db.searchObjects(searchtype, req.body.searchtext);
				res.render('objects', {
					title : 'Доступные небесные тела',
					login : req.user,
					info : data
				});
			}

		} catch (err) {
			next(err);
		}
	}
]);

router.get('/create', [
	async (req, res, next) => {
		try {
			res.render('objectcreate', {
				title : 'Добавление небесного тела',
				login : req.user,
				err : req.errors
			});
		} catch (err) {
			next(err);
		}
	}
]);

router.post('/create', [
	async (req, res, next) => {
		try {
			if (req.body.objname === '') {
				req.errors = [{msg : 'Введите название.'}];
				return next();
			}
			await db.createObject(
				req.body.objname,
				req.body.objh,
				req.body.obja,
				req.body.objinfo
			);
			res.redirect('/objects');
		} catch (err) {
			req.errors = [{msg : err.detail}];
			next();
		}
	},
	(req, res) => {
		res.render('objectcreate', {
			title : 'Добавление небесного тела',
			login : req.user,
			objname : req.body.objname,
			objh : req.body.objh,
			obja : req.body.obja,
			objinfo : req.body.objinfo,
			err : req.errors
		});
	}
]);

router.get('/:id', [
	async (req, res, next) => {
		try {
			var data = await db.objectByID(req.params.id);
			res.render('objectinfo', {
				title : 'Обзор небесного тела',
				login : req.user,
				info :  data,
				err : req.errors
			});
		} catch (err) {
			next(err);
		}
	}
]);

router.get('/:id/change', [
	async (req, res, next) => {
		try {
			var data = await db.objectByID(req.params.id);
			res.render('objectform', {
				title : 'Изменение небесного тела',
				login : req.user,
				info :  data,
				err : req.errors
			});
		} catch (err) {
			next(err);
		}
	}
]);

router.post('/:id/change', [
	async (req, res, next) => {
		try {
			if (req.body.objname === '') {
				req.errors = [{msg : 'Введите название.'}];
				return next();
			}
			await db.changeObject(
				req.params.id,
				req.body.objname,
				req.body.objh,
				req.body.obja,
				req.body.objinfo
			);
			res.redirect('/objects/' + req.params.id + '/change');
		} catch (err) {
			req.errors = [{msg : err.detail}];
			next();
		}
	},
	async (req, res, next) => {
		try {
			var data = await db.objectByID(req.params.id);
			res.render('objectform', {
				title : 'Изменение небесного тела',
				login : req.user,
				info :  data,
				err : req.errors
			});
		} catch (err) {
			next(err);
		}
	}
]);

router.get('/:id/delete', [
	async (req, res, next) => {
		try {
			await db.deleteObjectByID(req.params.id);
			res.redirect('/objects');
		} catch (err) {
			next(err);
		}
	}
]);

module.exports = router;

