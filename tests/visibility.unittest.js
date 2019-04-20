process.env.NODE_ENV = 'test'

const visibility = require(__dirname+'/../app/models/dbfunctions/visibility')
const visibility_r   = require(__dirname+'/../app/controllers/visibility')
const chai = require('chai')
const server = require(__dirname+'/../app/main')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const httpMocks = require('node-mocks-http') // quickly sets up REQUEST and RESPONSE to be passed into Express Middleware
var request = {} // define REQUEST
var response = {} // define RESPONSE

const should = chai.should()

chai.use(sinonChai)

var vis = {
	id : 1,
	telid : 2,
	objid : 3
}

describe('unit visibility test', () => {
	afterEach((done) => {
		sinon.restore()
		done()
	})

	it ('/get  visibility() should render visibility (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/',
			user : {username : 'Kazeshiro', role : 'admin'}
        })
		response = httpMocks.createResponse()
		var render = sinon.stub(response, 'render')
		var dbcall = sinon.stub(visibility,'visibility')
		dbcall.returns(vis)
		Promise.all([visibility_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			render.should.calledOnce
			render.should.calledWith('visibility', {
				title : 'Видимость',
  				login : {username : 'Kazeshiro', role : 'admin'},
  				info : vis
			})		
			done()
		})
		.catch((err) => {
			done(err)
		})
	})

	it ('/get  visibilityCreate() should render create visibility (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/create',
			user : {username : 'Kazeshiro', role : 'admin'}
        })
		response = httpMocks.createResponse()
		var render = sinon.stub(response, 'render')
		Promise.all([visibility_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			render.should.calledOnce
			render.should.calledWith('visibilitycreate', {
				title : 'Добавление видимости',
  				login : {username : 'Kazeshiro', role : 'admin'},
				err : undefined
			})		
			done()
		})
		.catch((err) => {
			done(err)
		})
	})

	it ('/post sortVisibility() should render sorted visibility (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'POST',
			url : '/sort',
			user : {username : 'Kazeshiro', role : 'admin'}
        })
		response = httpMocks.createResponse()
		var render = sinon.stub(response, 'render')
		var dbcall = sinon.stub(visibility,'sortVisibility')
		dbcall.returns(vis)
		Promise.all([visibility_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			render.should.calledOnce
			render.should.calledWith('visibility', {
				title : 'Видимость',
  				login : {username : 'Kazeshiro', role : 'admin'},
  				info : vis
			})		
			done()
		})
		.catch((err) => {
			done(err)
		})
	})
})