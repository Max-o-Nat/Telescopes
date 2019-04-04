var express = require('express')
var router = express.Router()
var db = require(__dirname + '/../models/dbfunctions/telescopes')

router.get('/create', [
	async (req, res, next) => {
		try {
			res.render('telescopecreate', {
				title : 'Добавление телескопа',
				login : req.user,
				err : req.errors
			})
		}
		catch(err) {
			next(err)
		}
	}
])

router.post('/create', [
	async (req, res, next) => {
		req.errors = []
		if (!req.body.name) 
			req.errors.push({ msg : 'Введите название телескопа.'})
		if (!req.body.telcountry) 
			req.errors.push({ msg : 'Введите город.'})
		if (!req.body.telcity) 
			req.errors.push({ msg : 'Введите страну.'})
		if (req.errors.length)
			return next()
		try {
			await db.createTelescope(
				req.body.name,
				req.body.type,
				req.body.telinfo,
				req.body.telcity,
				req.body.telcountry
			)
			res.redirect('/')
		}
		catch(err) {
			next(err)
		}
	},
	async (req, res, next) => {
		try {
			res.render('telescopecreate', {
				title : 'Добавление телескопа',
				login : req.user,
				name : req.body.name,
				type : req.body.type,
				telinfo : req.body.telinfo,
				telcity : req.body.telcity,
				telcountry : req.body.telcountry,
				err : req.errors
			})
		}
		catch(err) {
			next(err)
		}
	}
])

router.get('/:id', [
	async (req, res, next) => {
		try {
			var data = await db.telescopeByID(req.params.id)
			res.render('telescopeinfo', {
				title : 'Обзор телесокопа',
				login : req.user,
				info :  data,
				err : req.errors
			})
		}
		catch(err) {
			next(err)
		}
	}
])

router.get('/:id/change', [
	async (req, res, next) => {
		try {
			var data = await db.telescopeByID(req.params.id)
			res.render('telescopeform', {
				title : 'Обзор телесокопа',
				login : req.user,
				info :  data,
				err : req.errors
			})
		}
		catch(err) {
			next(err)
		}
	}
])

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
			res.redirect('/telescopes/'+req.params.id+'/change')
		}
		catch(err) {
			next(err)
		}
	},
	async (req, res, next) => {
		try {
			var data = await db.telescopeByID(req.params.id)
			res.render('telescopeform', {
				title : 'Обзор телесокопа',
				login : req.user,
				info :  data,
				err : req.errors
			})
		}
		catch(err) {
			next(err)
		}
	}
])

router.get('/:id/delete', [
	async (req, res, next) => {
		try {
			var data = await db.deleteTelescopeByID(req.params.id)
			res.redirect('/')
		}
		catch(err) {
			next(err)
		}
	}
])
module.exports = router

