process.env.NODE_ENV = 'test'

const dbx = require(__dirname+'/../app/models/dropbox')
const users      = require(__dirname + '/../app/models/dbfunctions/users')
const users_r      = require(__dirname+'/../app/controllers/users')
const chai = require('chai')
const server = require(__dirname+'/../app/main')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

var config = require(__dirname + '/../app/config/' + (process.env.NODE_ENV || 'development'))
var multer = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage : storage })

const httpMocks = require('node-mocks-http') // quickly sets up REQUEST and RESPONSE to be passed into Express Middleware
var request = {} // define REQUEST
var response = {} // define RESPONSE

const should = chai.should()

chai.use(sinonChai)

describe('sys users test', () => {
	afterEach((done) => {
		sinon.restore()
		done()
	})

	it ('/get  users() should redirect to /users/profile', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/',
			user : {username : 'Kazeshiro', role : 'user'}
        })
		response = httpMocks.createResponse()
		var redirect = sinon.stub(response, 'redirect')
		Promise.all([users_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			redirect.should.calledOnce
			redirect.should.calledWith('/users/profile')			
			done()
		})
		.catch((err) => {
			done(err)
		})
	})

	it ('/post changeRole() should redirect to /users/profile', (done) => {
		request = httpMocks.createRequest({
			method : 'POST',
			url : '/changerole/:id',
			user : {username : 'Kazeshiro', role : 'user'}
        })
		response = httpMocks.createResponse()
		var redirect = sinon.stub(response, 'redirect')
		Promise.all([users_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			redirect.should.calledOnce
			redirect.should.calledWith('/users/profile')			
			done()
		})
		.catch((err) => {
			done(err)
		})
	})

	it ('/post changeRole() should redirect to /users/profile (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'POST',
			url : '/changerole/:id',
			user : {username : 'Kazeshiro', role : 'admin'},
			params : {
				id : 1
			}
        })
		response = httpMocks.createResponse()
		var redirect = sinon.stub(response, 'redirect')
		var dbcall = sinon.stub(users,'changeRole')
		Promise.all([users_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			redirect.should.calledOnce
			redirect.should.calledWith('/users/profile/:id')			
			done()
		})
		.catch((err) => {
			done(err)
		})
	})

	it ('/get changeRole() should redirect to /users/profile', (done) => {
		request = httpMocks.createRequest({
			method : 'get',
			url : '/profile/:id',
			user : {username : 'Kazeshiro', role : 'user'}
        })
		response = httpMocks.createResponse()
		var redirect = sinon.stub(response, 'redirect')
		Promise.all([users_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			redirect.should.calledOnce
			redirect.should.calledWith('/users/profile')			
			done()
		})
		.catch((err) => {
			done(err)
		})
	})

	/*
	//странным образом неработающий тест
	it ('/post changeAvatar() after change should redirect to /users/profile', (done) => {
		request = httpMocks.createRequest({
			method : 'POST',
			url : '/profile/changeavatar',
			user : {username : 'Kazeshiro', role : 'user'},
			file : !undefined
        })
		let r = {
			name : 'name'
		}
		let data = [
			{
				userid : 1,
				avatar : config.defaultuseravatar
			}
		]
		response = httpMocks.createResponse()
		var redirect = sinon.stub(response, 'redirect')
		var single = sinon.stub(upload,'single')
		var logincall = sinon.stub(users,'userByLogin')
		logincall.returns(data)
		var uploadcall = sinon.stub(dbx, 'upload')
		uploadcall.returns(r)
		var dbcall = sinon.stub(users,'changeAvatar')
		Promise.all([users_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			redirect.should.calledOnce
			redirect.should.calledWith('/users/profile')			
			done()
		})
		.catch((err) => {
			done(err)
		})
	})*/
})