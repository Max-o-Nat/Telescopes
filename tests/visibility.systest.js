process.env.NODE_ENV = 'test'

const visibility = require(__dirname+'/../app/models/dbfunctions/visibility')
const visibility_r = require(__dirname+'/../app/controllers/visibility')
const chai = require('chai')
const server = require(__dirname+'/../app/main')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const httpMocks = require('node-mocks-http') // quickly sets up REQUEST and RESPONSE to be passed into Express Middleware
var request = {} // define REQUEST
var response = {} // define RESPONSE

const should = chai.should()

chai.use(sinonChai)

describe('sys visibility test', () => {
	afterEach((done) => {
		sinon.restore()
		done()
	})

	it ('/post visibilityCreate() should redirect to /visibility (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'POST',
			url : '/create',
			user : {username : 'Kazeshiro', role : 'admin'}
        })
		response = httpMocks.createResponse()
		var redirect = sinon.stub(response, 'redirect')
		var dbcall = sinon.stub(visibility,'createVisibility')
		Promise.all([visibility_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			redirect.should.calledOnce
			redirect.should.calledWith('/visibility')			
			done()
		})
		.catch((err) => {
			done(err)
		})
	}) 

	it ('/get  visibilityDelete() should redirect to /visibility (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/:id/delete',
			user : {username : 'Kazeshiro', role : 'admin'}
        })
		response = httpMocks.createResponse()
		var redirect = sinon.stub(response, 'redirect')
		var dbcall = sinon.stub(visibility,'deleteVisibilityByID')
		Promise.all([visibility_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			redirect.should.calledOnce
			redirect.should.calledWith('/visibility')			
			done()
		})
		.catch((err) => {
			done(err)
		})
	})
})