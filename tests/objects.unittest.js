process.env.NODE_ENV = 'test'

const objects    = require(__dirname+'/../app/models/dbfunctions/objects')
const objects_r      = require(__dirname+'/../app/controllers/objects')
const chai = require('chai')
const server = require(__dirname+'/../app/main')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const httpMocks = require('node-mocks-http') // quickly sets up REQUEST and RESPONSE to be passed into Express Middleware
var request = {} // define REQUEST
var response = {} // define RESPONSE

const should = chai.should()

chai.use(sinonChai)

var obj = {
	objname : 'smth',
	objh : '11',
	obja : '23',
	objinfo : 'ds'
}

describe('unit objects test', () => {
	afterEach((done) => {
		sinon.restore()
		done()
	})

	it ('/get  objectByID() should render object', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/:id',
			user : {username : 'Kazeshiro', role : 'admin'}
        })
		response = httpMocks.createResponse()
		var render = sinon.stub(response, 'render')
		var dbcall = sinon.stub(objects,'objectByID')
		dbcall.returns(obj)
		Promise.all([objects_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			render.should.calledOnce
			render.should.calledWith('objectinfo', {
				title : 'Обзор небесного тела',
  				login : {username : 'Kazeshiro', role : 'admin'},
				info : obj,
				err : undefined
			})
			done()
		})
		.catch((err) => {
			done(err)
		})
	}) 

	it ('/get  objectByID() should render object`s change (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/:id/change',
			user : {username : 'Kazeshiro', role : 'admin'}
        })
		response = httpMocks.createResponse()
		var render = sinon.stub(response, 'render')
		var dbcall = sinon.stub(objects,'objectByID')
		dbcall.returns(obj)
		Promise.all([objects_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			render.should.calledOnce
			render.should.calledWith('objectform', {
				title : 'Изменение небесного тела',
  				login : {username : 'Kazeshiro', role : 'admin'},
				info : obj,
				err : undefined
			})
			done()
		})
		.catch((err) => {
			done(err)
		})
	})

	it ('/post objectByID() should render change object (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'POST',
			url : '/:id/change',
			user : {username : 'Kazeshiro', role : 'admin'},
			body : {
				objname : ''
			}
        })
		response = httpMocks.createResponse()
		var render = sinon.stub(response, 'render')		
		var dbcall = sinon.stub(objects,'objectByID')
		dbcall.returns(obj)
		Promise.all([objects_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			render.should.calledOnce
			render.should.calledWith('objectform', {
				title : 'Изменение небесного тела',
  				login : {username : 'Kazeshiro', role : 'admin'},
				info : obj,
				err : [{msg : 'Введите название.'}]
			})
			done()
		})
		.catch((err) => {
			done(err)
		})
	})

	it ('/get  objectCreate() should render create object (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/create',
			user : {username : 'Kazeshiro', role : 'admin'}
        })
		response = httpMocks.createResponse()
		var render = sinon.stub(response, 'render')
		Promise.all([objects_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			render.should.calledOnce
			render.should.calledWith('objectcreate', {
				title : 'Добавление небесного тела',
  				login : {username : 'Kazeshiro', role : 'admin'},
				err : undefined
			})
			done()
		})
		.catch((err) => {
			done(err)
		})
	})
})