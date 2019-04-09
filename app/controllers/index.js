var express = require('express');
var router = express.Router();
var db = require(__dirname + '/../models/dbfunctions/telescopes');
var {sanitizeBody} = require('express-validator/filter');

router.get('/', async (req, res, next) => {
	try {
		var data = await db.telescopes();
		res.render('index', {
			title : 'Доступные телескопы',
			login : req.user,
			info : data
		});
	} catch (err) {
		next(err);
	}
});

router.post('/sort', async (req, res, next) => {
	try {
		var data = await db.sortTelescopes(req.body.sorttype);
		res.render('index', {
			title : 'Доступные телескопы',
			login : req.user,
			info : data
		});

	} catch (err) {
		next(err);
	}
});

router.post('/search', [
	sanitizeBody('searchtext').trim().escape(),
	async (req, res, next) => {
		try {
			var data = await db.searchTelescopes(req.body.searchtype,
				req.body.searchtext);
			res.render('index', {
				title : 'Доступные телескопы',
				login : req.user,
				info : data
			});
		} catch (err) {
			next(err);
		}
	}
]);

module.exports = router;
