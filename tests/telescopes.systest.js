const path = require('path')
process.env.NODE_ENV = 'test'

const telescopes = require(path.join(__dirname, '/../app/models/dbfunctions/telescopes'))
const telescopes_r = require(path.join(__dirname, '/../app/controllers/telescopes'))
const index_r = require(path.join(__dirname, '/../app/controllers/index'))
const chai = require('chai')
const server = require(path.join(__dirname, '/../app/main'))
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const httpMocks = require('node-mocks-http') // quickly sets up REQUEST and RESPONSE to be passed into Express Middleware
var request = {} // define REQUEST
var response = {} // define RESPONSE

const should = chai.should()

chai.use(sinonChai)

var tel1 = {
  telescopeid: 1,
  telescopename: 'hehehe',
  telescopetype: 'рефлектор',
  telescopeinfo: '',
  country: 'Россия',
  city: 'Москва' 
}

describe('sys telescopes and visibility test', () => {
  afterEach((done) => {
    sinon.restore()
    done()
  })

  it ('/post telescopeCreate() after create should redirect to / (admin call)', (done) => {
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/create',
      user: {username : 'Kazeshiro', role : 'admin'},
      body: {
        name: tel1.telescopename,
        type: tel1.telescopetype,
        telinfo: tel1.telescopeinfo,
        telcity: tel1.city,
        telcountry: tel1.country
      }
    })
    response = httpMocks.createResponse()
    var redirect = sinon.stub(response, 'redirect')
    var dbcall = sinon.stub(telescopes,'createTelescope')
    Promise.all([telescopes_r(request, response, (err) => {
      if (err)
        done(err)
    })])
    .then(() => {
      redirect.should.calledOnce
      redirect.should.calledWith('/')
      done()
    })
    .catch((err) => {
      done(err)
    })
  })

  it ('/post telescopeChange() after change should redirect to /telescopes/id/change (admin call)', (done) => {
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/:id/change',
      user: {username : 'Kazeshiro', role : 'admin'},
      params: {
        id: tel1.telescopeid
      },
      body: {
        name: tel1.telescopename,
        type: tel1.telescopetype,
        telinfo: tel1.telescopeinfo,
        telcity: tel1.city,
        telcountry: tel1.country
      }
    })
    response = httpMocks.createResponse()
    var redirect = sinon.stub(response, 'redirect')
    var dbcall = sinon.stub(telescopes,'changeTelescope')
    Promise.all([telescopes_r(request, response, (err) => {
      if (err)
        done(err)
    })])
    .then(() => {
      redirect.should.calledOnce
      redirect.should.calledWith('/telescopes/:id/change')
      done()
    })
    .catch((err) => {
      done(err)
    })
  }) 

  it ('/get deleteTelescopeByID() after delete should redirect to / (admin call)', (done) => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/:id/delete',
      user: {username : 'Kazeshiro', role : 'admin'},
      params: {
        id: tel1.telescopeid
      }
    })
    response = httpMocks.createResponse()
    var redirect = sinon.stub(response, 'redirect')
    var dbcall = sinon.stub(telescopes,'deleteTelescopeByID')
    Promise.all([telescopes_r(request, response, (err) => {
      if (err)
        done(err)
    })])
    .then(() => {
      redirect.should.calledOnce
      redirect.should.calledWith('/')
      done()
    })
    .catch((err) => {
      done(err)
    })
  })
})