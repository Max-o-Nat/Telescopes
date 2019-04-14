const db = require(__dirname + '/../db.js').db

async function objects () {
  try {
    var data = await db.func('Objects')
    return data
  } catch (err) {
    throw err
  }
}

async function sortObjects () {
  try {
    var data = await db.func('SortObjects')
    return data
  } catch (err) {
    throw err
  }
}

async function searchObjects (searchtype, searchtext) {
  try {
    var data = await db.func('SearchObjects', [searchtype, searchtext])
    return data
  } catch (err) {
    throw err
  }
}

async function createObject (objname, objh, obja, objinfo) {
  try {
    await db.func('CreateObject', [
      objname,
      objh,
      obja,
      objinfo
    ])
  } catch (err) {
    throw err
  }
}

async function objectByID (id) {
  try {
    var data = await db.func('ObjectByID', id)
    return data
  } catch (err) {
    throw err
  }
}

async function changeObject (id, objname, objh, obja, objinfo) {
  try {
    await db.func('ChangeObject', [
      id,
      objname,
      objh,
      obja,
      objinfo
    ])
  } catch (err) {
    throw err
  }
}

async function deleteObjectByID (id) {
  try {
    await db.func('DeleteObjectByID', id)
  } catch (err) {
    throw err
  }
}

module.exports = {
  objects: objects,
  sortObjects: sortObjects,
  searchObjects: searchObjects,
  createObject: createObject,
  objectByID: objectByID,
  changeObject: changeObject,
  deleteObjectByID: deleteObjectByID
}
