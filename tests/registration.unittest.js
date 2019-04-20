process.env.NODE_ENV = 'test'

const registration_r = require(__dirname+'/../app/controllers/registration')
const chai = require('chai')
const server = require(__dirname+'/../app/main')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const httpMocks = require('node-mocks-http') // quickly sets up REQUEST and RESPONSE to be passed into Express Middleware
var request = {} // define REQUEST
var response = {} // define RESPONSE

const should = chai.should()

chai.use(sinonChai)

describe('unit regestration test', () => {
	afterEach((done) => {
		sinon.restore()
		done()
	})

	it ('/get  registration() should render regestration', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/'
        })
		response = httpMocks.createResponse()
		var render = sinon.stub(response, 'render')
		Promise.all([registration_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			render.should.calledOnce
			render.should.calledWith('registration', {
				title : 'Регистрация'
			})		
			done()
		})
		.catch((err) => {
			done(err)
		})
	}) 	
})