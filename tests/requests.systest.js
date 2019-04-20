process.env.NODE_ENV = 'test'

const dbx = require(__dirname+'/../app/models/dropbox')
const requests   = require(__dirname+'/../app/models/dbfunctions/requests')
const requests_r    = require(__dirname+'/../app/controllers/requests')
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

describe('sys requests test', () => {
	afterEach((done) => {
		sinon.restore()
		done()
	})

	it ('/post requestCreate() should redirect to /requests', (done) => {
		request = httpMocks.createRequest({
			method : 'POST',
			url : '/create/:telid',
			user : {username : 'Kazeshiro', role : 'admin'}
        })
		response = httpMocks.createResponse()
		var redirect = sinon.stub(response, 'redirect')
		var dbcall = sinon.stub(requests,'createRequest')
		Promise.all([requests_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			redirect.should.calledOnce
			redirect.should.calledWith('/requests')			
			done()
		})
		.catch((err) => {
			done(err)
		})
	})

	it ('/post requestUpdate() should redirect to /requests (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'POST',
			url : '/:id/update',
			user : {username : 'Kazeshiro', role : 'admin'},
			file : !undefined
        })
		let r = {
			name : 'name'
		}
		response = httpMocks.createResponse()
		var redirect = sinon.stub(response, 'redirect')
		var single = sinon.stub(upload,'single')
		let uploadphoto = sinon.stub(dbx, 'uploadphoto')
		uploadphoto.returns(r)
		var dbcall = sinon.stub(requests,'createAstrophoto')
		Promise.all([requests_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			redirect.should.calledOnce
			redirect.should.calledWith('/requests')			
			done()
		})
		.catch((err) => {
			done(err)
		})
	})

	it ('/get  deleteRequestByID() should redirect to /requests', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/:id/delete',
			user : {username : 'Kazeshiro', role : 'admin'}
        })
		response = httpMocks.createResponse()
		var redirect = sinon.stub(response, 'redirect')
		var dbcall = sinon.stub(requests,'deleteRequestByID')
		Promise.all([requests_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			redirect.should.calledOnce
			redirect.should.calledWith('/requests')			
			done()
		})
		.catch((err) => {
			done(err)
		})
	})
})