const path = require('path')
const db = require(path.join(__dirname, '/../db.js')).db

async function visibility () {
  try {
    var data = await db.func('Visibility')
    return data
  } catch (err) {
    throw err
  }
}

async function sortVisibility () {
  try {
    var data = await db.func('SortVisibility')
    return data
  } catch (err) {
    throw err
  }
}

async function telescopeVisibility (searchtext) {
  try {
    var data = await db.func('telescopeVisibility', searchtext)
    return data
  } catch (err) {
    throw err
  }
}

async function objectVisibility (searchtext) {
  try {
    var data = await db.func('ObjectVisibility', searchtext)
    return data
  } catch (err) {
    throw err
  }
}

async function createVisibility (ids) {
  try {
    var data = await db.func('CreateVisibility', ids)
    return data
  } catch (err) {
    throw err
  }
}

async function deleteVisibilityByID (id) {
  try {
    var data = await db.func('DeleteVisibilityByID', id)
    return data
  } catch (err) {
    throw err
  }
}

module.exports = {
  visibility: visibility,
  sortVisibility: sortVisibility,
  telescopeVisibility: telescopeVisibility,
  objectVisibility: objectVisibility,
  createVisibility: createVisibility,
  deleteVisibilityByID: deleteVisibilityByID
}
