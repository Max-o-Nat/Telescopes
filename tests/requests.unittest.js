process.env.NODE_ENV = 'test'

const dbx = require(__dirname+'/../app/models/dropbox')
const requests   = require(__dirname+'/../app/models/dbfunctions/requests')
const requests_r     = require(__dirname+'/../app/controllers/requests')
const chai = require('chai')
const server = require(__dirname+'/../app/main')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

var multer = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage : storage })

const httpMocks = require('node-mocks-http') // quickly sets up REQUEST and RESPONSE to be passed into Express Middleware
var request = {} // define REQUEST
var response = {} // define RESPONSE

const should = chai.should()

chai.use(sinonChai)

var req_a = {
	rid : 1,
	uid : 2,
	telid : 3,
	objid : 4
}
var req_u = {
	rid : 1,
	telid : 3,
	objid : 4
}
var tel = {
	telescopeid : 1,
	telescopename : 'test',
	telescopes : 1 + ' test'
}

describe('unit requests test', () => {
	afterEach((done) => {
		sinon.restore()
		done()
	})

	it ('/get  requests() should render requests (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/',
			user : {username : 'Kazeshiro', role : 'admin'}
        })
		response = httpMocks.createResponse()
		var render = sinon.stub(response, 'render')
		var dbcall = sinon.stub(requests, 'requests')
		dbcall.returns(req_a)
		Promise.all([requests_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			render.should.calledOnce
			render.should.calledWith('requests', {
				title : 'Запросы',
  				login : {username : 'Kazeshiro', role : 'admin'},
  				info : req_a
			})		
			done()
		})
		.catch((err) => {
			done(err)
		})
	})

	it ('/get  requests() should render requests', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/',
			user : {username : 'Kazeshiro', role : 'user'}
        })
		response = httpMocks.createResponse()
		var render = sinon.stub(response, 'render')
		var dbcall = sinon.stub(requests, 'userRequests')
		dbcall.returns(req_u)
		Promise.all([requests_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			render.should.calledOnce
			render.should.calledWith('requests', {
				title : 'Запросы',
  				login : {username : 'Kazeshiro', role : 'user'},
  				info : req_u
			})		
			done()
		})
		.catch((err) => {
			done(err)
		})
	})

	it ('/get  requestTelescopes() should render create requests', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/create',
			user : {username : 'Kazeshiro', role : 'user'}
        })
		response = httpMocks.createResponse()
		var render = sinon.stub(response, 'render')
		var dbcall = sinon.stub(requests, 'requestTelescopes')
		dbcall.returns(tel.telescopes)
		Promise.all([requests_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			render.should.calledOnce
			render.should.calledWith('requestcreate', {
				title : 'Создание запроса',
  				login : {username : 'Kazeshiro', role : 'user'},
  				telescopes : tel.telescopes
			})		
			done()
		})
		.catch((err) => {
			done(err)
		})
	})

	it ('/get  requestUpdate should render update', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/:id/update',
			user : {username : 'Kazeshiro', role : 'admin'}
        })
		response = httpMocks.createResponse()
		var render = sinon.stub(response, 'render')
		Promise.all([requests_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			render.should.calledOnce
			render.should.calledWith('requestupdate', {
				title : 'Выполнение запроса',
  				login : {username : 'Kazeshiro', role : 'admin'},
  				rid : ':id',
				err : undefined
			})		
			done()
		})
		.catch((err) => {
			done(err)
		})
	}) 

	it ('/post requestUpdate should render error update', (done) => {
		request = httpMocks.createRequest({
			method : 'POST',
			url : '/:id/update',
			user : {username : 'Kazeshiro', role : 'admin'},
			file : undefined
        })
		response = httpMocks.createResponse()
		var single = sinon.stub(upload,'single')
		var render = sinon.stub(response, 'render')
		Promise.all([requests_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			render.should.calledOnce
			render.should.calledWith('requestupdate', {
				title : 'Выполнение запроса',
  				login : {username : 'Kazeshiro', role : 'admin'},
  				rid : ':id',
				err : [ { msg : 'Не выбран файл' } ]
			})		
			done()
		})
		.catch((err) => {
			done(err)
		})
	}) 
})