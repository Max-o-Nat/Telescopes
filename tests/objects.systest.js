process.env.NODE_ENV = 'test'

const objects    = require(__dirname+'/../app/models/dbfunctions/objects')
const objects_r    = require(__dirname+'/../app/controllers/objects')
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

describe('sys objects test', () => {
	afterEach((done) => {
		sinon.restore()
		done()
	})	

	it ('/post createObject() after create should redirect to /objects (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'POST',
			url : '/create',
			user : {username : 'Kazeshiro', role : 'admin'},
			body : {
				objname : obj.objname,
				objh : obj.objh,
				obja : obj.obja,
				objinfo : obj.objinfo
			}
        })
		response = httpMocks.createResponse()
		var redirect = sinon.stub(response, 'redirect')
		var dbcall = sinon.stub(objects,'createObject')
		Promise.all([objects_r(request, response,  (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			redirect.should.calledOnce
			redirect.should.calledWith('/objects')			
			done()
		})
		.catch((err) => {
			done(err)
		})
	})

	it ('/post changeObject() after change should redirect to /objects/id/change (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'POST',
			url : '/:id/change',
			user : {username : 'Kazeshiro', role : 'admin'},
			params : {
				id : 1
			},
			body : {
				objname : obj.objname,
				objh : obj.objh,
				obja : obj.obja,
				objinfo : obj.objinfo
			}
        })
		response = httpMocks.createResponse()
		var redirect = sinon.stub(response, 'redirect')
		var dbcall = sinon.stub(objects,'changeObject')
		Promise.all([objects_r(request, response,  (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			redirect.should.calledOnce
			redirect.should.calledWith('/objects/:id/change')			
			done()
		})
		.catch((err) => {
			done(err)
		})
	})

	it ('/get  deleteObjectByID() after delete should redirect to /objects (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/:id/delete',
			user : {username : 'Kazeshiro', role : 'admin'}
        })
		response = httpMocks.createResponse()
		var redirect = sinon.stub(response, 'redirect')
		var dbcall = sinon.stub(objects,'deleteObjectByID')
		Promise.all([objects_r(request, response,  (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			redirect.should.calledOnce
			redirect.should.calledWith('/objects')			
			done()
		})
		.catch((err) => {
			done(err)
		})
	})
})