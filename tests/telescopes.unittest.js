const path = require('path')
process.env.NODE_ENV = 'test'

const telescopes = require(path.join(__dirname, '/../app/models/dbfunctions/telescopes'))
const visibility = require(path.join(__dirname, '/../app/models/dbfunctions/visibility'))
const requests   = require(path.join(__dirname, '/../app/models/dbfunctions/requests'))
const objects    = require(path.join(__dirname, '/../app/models/dbfunctions/objects'))
const telescopes_r = require(path.join(__dirname, '/../app/controllers/telescopes'))
const visibility_r = require(path.join(__dirname, '/../app/controllers/visibility'))
const requests_r   = require(path.join(__dirname, '/../app/controllers/requests'))
const objects_r    = require(path.join(__dirname, '/../app/controllers/objects'))
const index_r      = require(path.join(__dirname, '/../app/controllers/index'))
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
var tel2 = {
  telescopeid: 2,
  telescopename: 'kek',
  telescopetype: 'катадиоптрический',
  telescopeinfo: 'new telescope',
  country: 'Франция',
  city: 'Париж' 
}
var tel3 = {
  telescopeid: 3,
  telescopename: 'miu',
  telescopetype: 'рефрактор',
  telescopeinfo: 'best telescope',
  country: 'Китай',
  city: 'Пекин' 
}
var obj = {
  objname: 'smth',
  objh: '11',
  obja: '23',
  objinfo: 'ds'
}

describe('unit router test', () => {
  afterEach((done) => {
    sinon.restore()
    done()
  })

  it ('/get  telescopes() should render 1 telescope (admin call)', (done) => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      user: {username : 'Kazeshiro', role : 'admin'}
    })
    response = httpMocks.createResponse()
    var render = sinon.stub(response, 'render')
    var dbcall = sinon.stub(telescopes,'telescopes')
    dbcall.returns([tel1])
    Promise.all([index_r(request, response, (err) => {
      if (err)
        done(err)
    })])
    .then(() => {
      render.should.calledOnce
      render.should.calledWith('index', {
        title: 'Доступные телескопы',
        login: {username : 'Kazeshiro', role : 'admin'},
        info: [tel1]
      })
      done()
    })
    .catch((err) => {
      done(err)
    })
  }) 
  

  it ('/get  telescopes() should render 1 telescope (user call)', (done) => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      user: {username : 'Kazeshiro', role : 'user'}
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
        title: 'Доступные телескопы', 
        login: {username : 'Kazeshiro', role : 'user'},
        info: [tel1]
      })
      done()
    })
    .catch((err) => {
      done(err)
    })
  }) 

  it ('/get  telescopes() should render without telescopes', (done) => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      user: {username : 'Kazeshiro', role : 'user'}
    })
    response = httpMocks.createResponse()
    var render = sinon.stub(response, 'render')
    var dbcall = sinon.stub(telescopes,'telescopes')
    dbcall.returns([])
    Promise.all([index_r(request, response,  (err) => {
      if (err)
        done(err)
    })])
    .then(() => {
      render.should.calledOnce
      render.should.calledWith('index', {
        title: 'Доступные телескопы',
        login: {username : 'Kazeshiro', role : 'user'},
        info: []
      })
      done()
    })
    .catch((err) => {
      done(err)
    })
  })

  it ('/get  telescopes() should render with 3 telescopes', (done) => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      user: {username : 'Kazeshiro', role : 'admin'}
    })
    response = httpMocks.createResponse()
    var render = sinon.stub(response, 'render')
    var dbcall = sinon.stub(telescopes,'telescopes')
    dbcall.returns([tel1, tel2, tel3])
    Promise.all([index_r(request, response,  (err) => {
      if (err)
        done(err)
    })])
    .then(() => {
      render.should.calledOnce
      render.should.calledWith('index', {
        title: 'Доступные телескопы',
        login: {username : 'Kazeshiro', role : 'admin'},
        info: [tel1, tel2, tel3]
      })
      done()
    })
    .catch((err) => {
      done(err)
    })
  }) 

  it ('/get  telecsopeCreate() should render telescope`s create (admin call)', (done) => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/create',
      user: {username : 'Kazeshiro', role : 'admin'}
    })
    response = httpMocks.createResponse()
    var render = sinon.stub(response, 'render')
    Promise.all([telescopes_r(request, response,  (err) => {
      if (err)
        done(err)
    })])
    .then(() => {
      render.should.calledOnce
      render.should.calledWith('telescopecreate', {
        title: 'Добавление телескопа',
        login: {username : 'Kazeshiro', role : 'admin'},
        err: undefined
      })
      done()
    })
    .catch((err) => {
      done(err)
    })
  })

  it ('/post telescopeCreate() should catch error with telescope`s name (admin call)', (done) => {
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/create',
      user: {username : 'Kazeshiro', role : 'admin'},
      body: {
        type: tel1.telescopetype,
        telinfo: tel1.telescopeinfo,
        telcity: tel1.city,
        telcountry: tel1.country
      }
    })
    response = httpMocks.createResponse()
    var render = sinon.stub(response, 'render')
    var dbcall = sinon.stub(telescopes,'createTelescope')
    Promise.all([telescopes_r(request, response,  (err) => {
      if (err)
        done(err)
    })])
    .then(() => {render.should.calledWith('telescopecreate', {
        title: 'Добавление телескопа',
        login: { username : 'Kazeshiro', role : 'admin'},
        name: undefined,
        type: tel1.telescopetype,
        telinfo: tel1.telescopeinfo,
        telcity: tel1.city,
        telcountry: tel1.country,
        err: [{msg : 'Введите название телескопа.'}]
      })      
      done()
    })
    .catch((err) => {
      done(err)
    })
  })

  it ('/post telescopeCreate() should catch error with telescope`s country and city (admin call)', (done) => {
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/create',
      user: {username : 'Kazeshiro', role : 'admin'},
      body: {
        name: tel1.telescopename,
        type: tel1.telescopetype,
        telinfo: tel1.telescopeinfo
      }
    })
    response = httpMocks.createResponse()
    var render = sinon.stub(response, 'render')
    var dbcall = sinon.stub(telescopes,'createTelescope') +
    Promise.all([telescopes_r(request, response,  (err) => {
      if (err)
        done(err)
    })])
    .then(() => {render.should.calledWith('telescopecreate', {
        title: 'Добавление телескопа',
        login: { username : 'Kazeshiro', role : 'admin'},
        name: tel1.telescopename,
        type: tel1.telescopetype,
        telinfo: tel1.telescopeinfo,
        telcity: undefined,
        telcountry: undefined,
        err: [
          {msg : 'Введите город.'},
          {msg : 'Введите страну.'}
        ]
      })
      done()
    })
    .catch((err) => {
      done(err)
    })
  })
})