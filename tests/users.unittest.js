process.env.NODE_ENV = 'test'

const users    = require(__dirname+'/../app/models/dbfunctions/users')
const users_r      = require(__dirname+'/../app/controllers/users')
const chai = require('chai')
const server = require(__dirname+'/../app/main')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const httpMocks = require('node-mocks-http') // quickly sets up REQUEST and RESPONSE to be passed into Express Middleware
var request = {} // define REQUEST
var response = {} // define RESPONSE

const should = chai.should()

chai.use(sinonChai)

var usr = [{ userid: 56,
    login: 'heufjxissh',
    email: 'adfviloriw@mail.ru',
    avatar: '/public/images/userphoto/defaultuseravatar.png',
    userinfo: '' 
},{
	userid: 59,
    login: 'wntafpgrdy',
    email: 'xmiakruozu@gmail.com',
    avatar: '/public/images/userphoto/defaultuseravatar.png',
    userinfo: '' 
}]

describe('unit users test', () => {
	afterEach((done) => {
		sinon.restore()
		done()
	})

	it ('/get  users() should render user (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/',
			user : {username : 'Kazeshiro', role : 'admin'}
        })
		response = httpMocks.createResponse()
		var render = sinon.stub(response, 'render')
		var dbcall = sinon.stub(users, 'users')
		dbcall.returns([usr[0]])
		Promise.all([users_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			render.should.calledOnce
			render.should.calledWith('users', {
				title : 'Пользователи',
  				login : {username : 'Kazeshiro', role : 'admin'},
				info : [usr[0]]
			})
			done()
		})
		.catch((err) => {
			done(err)
		})
	}) 

	it ('/get  users() should render users (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/',
			user : {username : 'Kazeshiro', role : 'admin'}
        })
		response = httpMocks.createResponse()
		var render = sinon.stub(response, 'render')
		var dbcall = sinon.stub(users, 'users')
		dbcall.returns(usr)
		Promise.all([users_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			render.should.calledOnce
			render.should.calledWith('users', {
				title : 'Пользователи',
  				login : {username : 'Kazeshiro', role : 'admin'},
				info : usr
			})
			done()
		})
		.catch((err) => {
			done(err)
		})
	}) 

	it ('/get  users() should render without users (admin call)', (done) => {
		request = httpMocks.createRequest({
			method : 'GET',
			url : '/',
			user : {username : 'Kazeshiro', role : 'admin'}
        })
		response = httpMocks.createResponse()
		var render = sinon.stub(response, 'render')
		var dbcall = sinon.stub(users, 'users')
		Promise.all([users_r(request, response, (err) => {
			if (err)                
				done(err)
		})])
		.then(() => {
			render.should.calledOnce
			render.should.calledWith('users', {
				title : 'Пользователи',
  				login : {username : 'Kazeshiro', role : 'admin'},
				info : undefined
			})
			done()
		})
		.catch((err) => {
			done(err)
		})
	}) 
})