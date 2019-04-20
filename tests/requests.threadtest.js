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
var th_request = {} // define REQUEST
var response = {} // define RESPONSE
var th_response = {} // define RESPONSE

const should = chai.should()

chai.use(sinonChai)

describe('thread requests test', () => {
	afterEach((done) => {
		sinon.restore()
		done()
	})

	it ('/get requestUpdate() should redirect to /requests if someone have already performed (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/8/update',
			user : {username : 'Kazeshiro', role : 'admin'}
        })
		response = httpMocks.createResponse()
		Promise.all([requests_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {	
			th_request = httpMocks.createRequest({
			method : 'GET',
			url : '/8/update',
			user : {username : 'kaze', role : 'admin'}
	        })
			th_response = httpMocks.createResponse()
			var th_redirect = sinon.stub(th_response, 'redirect')
			Promise.all([requests_r(th_request, th_response, (err) => {
				if (err)                
					done(err)
			})])
			.then(() => {
				th_redirect.should.calledOnce
				th_redirect.should.calledWith('/requests')			
				done()
			})
			.catch((err) => {
				done(err)
			})
		})
		.catch((err) => {
			done(err)
		})		
	})

	it ('/get requestUpdate() should accept both request (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/8/update',
			user : {username : 'Kazeshiro', role : 'admin'}
        })
		response = httpMocks.createResponse()
		Promise.all([requests_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {	
			th_request = httpMocks.createRequest({
			method : 'GET',
			url : '/2/update',
			user : {username : 'kaze', role : 'admin'}
	        })
			th_response = httpMocks.createResponse()
			Promise.all([requests_r(th_request, th_response, (err) => {
				if (err)                
					done(err)
			})])
			.then(() => {		
				done()
			})
			.catch((err) => {
				done(err)
			})
		})
		.catch((err) => {
			done(err)
		})		
	})
})