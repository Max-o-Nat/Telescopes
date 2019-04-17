const path = require('path')
const db = require(path.join(__dirname, '/../db.js')).db

async function requests () {
  try {
    var data = await db.func('Requests')
    return data
  } catch (err) {
    throw err
  }
}

async function userRequests (id) {
  try {
    var data = await db.func('UserRequests', id)
    return data
  } catch (err) {
    throw err
  }
}

async function requestTelescopes () {
  try {
    var data = await db.func('RequestTelescopes')
    var telescopes = []
    for (var i = data.length - 1; i >= 0; i--) { telescopes.push(data[i].telescopeid + ' ' + data[i].telescopename) }

    return telescopes
  } catch (err) {
    throw err
  }
}

async function telescopeVisibility (id) {
  try {
    var data = await db.func('TelescopeVisibility', id)
    var objects = []
    for (var i = data.length - 1; i >= 0; i--) { objects.push(data[i].objid + ' ' + data[i].objname) }

    return objects
  } catch (err) {
    throw err
  }
}

async function createRequest (username, telid, objname) {
  try {
    await db.func('CreateRequest', [
      username,
      telid,
      parseInt(objname)
    ])
  } catch (err) {
    throw err
  }
}

async function createAstrophoto (id, name) {
  try {
    await db.func('CreateAstrophoto', [id, name])
  } catch (err) {
    throw err
  }
}

async function deleteRequestByID (id) {
  try {
    await db.func('DeleteRequestByID', id)
  } catch (err) {
    throw err
  }
}

module.exports = {
  requests: requests,
  userRequests: userRequests,
  telescopeVisibility: telescopeVisibility,
  createRequest: createRequest,
  createAstrophoto: createAstrophoto,
  deleteRequestByID: deleteRequestByID,
  requestTelescopes: requestTelescopes
}
