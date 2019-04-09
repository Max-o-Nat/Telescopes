process.env.NODE_ENV = 'test'

const telescopes        = require(__dirname+'/../app/models/dbfunctions/telescopes')
const index_r        = require(__dirname+'/../app/controllers/index')
const chai = require('chai')
const server = require(__dirname+'/../app/main')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const httpMocks = require('node-mocks-http') // quickly sets up REQUEST and RESPONSE to be passed into Express Middleware
var request = {} // define REQUEST
var response = {} // define RESPONSE

const should = chai.should()

chai.use(sinonChai)

var tel1 = {
	telescopeid : 1,
	telescopename : 'hehehe',
	telescopetype : 'рефлектор',
	telescopeinfo : '',
	country : 'Россия',
	city : 'Москва' 
}

describe('index router test', () => {
	afterEach((done) => {
		sinon.restore()
		done()
	})

	it ('/get  telescopes() should render 1 telescope', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/'
        })
		response = httpMocks.createResponse()
		var render = sinon.stub(response, 'render')
		var dbcall = sinon.stub(telescopes,'telescopes')
		dbcall.returns([tel1])
		Promise.all([index_r(request, response,  (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			render.should.calledOnce
			render.should.calledWith('index', {
				title : 'Доступные телескопы',
				info : [tel1],
				login: undefined
			})
			done()
		})
		.catch((err) => {
			done(err)
		})
	}) 
	
})	