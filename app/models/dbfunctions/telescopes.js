const db = require(__dirname + '/../db.js').db

async function telescopes () {
  try {
    var data = await db.func('Telescopes')
    var newdata = []
    for (var i = 0; i < data.length; i++) {
      newdata.push({
        id: data[i].telescopeid,
        name: data[i].telescopename,
        type: data[i].telescopetype,
        city: data[i].city,
        country: data[i].country
      })
    }
    return newdata
  } catch (err) {
    throw err
  }
}

async function sortTelescopes (sorttype) {
  if (!sorttype ||
			((sorttype !== 'Тип телескопа') &&
			(sorttype !== 'Город') &&
			(sorttype !== 'Страна'))) {
    throw new Error('Bad sort type')
  }
  try {
    var data = await db.func('SortTelescopes', sorttype)
    var newdata = []
    for (var i = 0; i < data.length; i++) {
      newdata.push({
        id: data[i].telescopeid,
        name: data[i].telescopename,
        type: data[i].telescopetype,
        city: data[i].city,
        country: data[i].country
      })
    }
    return newdata
  } catch (err) {
    throw err
  }
}

async function searchTelescopes (searchtype, searchtext) {
  if (!searchtype ||
			((searchtype !== 'Город') &&
			(searchtype !== 'Страна'))) {
    throw new Error('Bad search type')
  }
  if (!searchtext || !(typeof searchtext === 'string')) {
    throw new Error('Bad search text')
  }
  searchtext = searchtext || ''
  try {
    var data = await db.func('SearchTelescopes', [searchtype, searchtext])
    var newdata = []
    for (var i = 0; i < data.length; i++) {
      newdata.push({
        id: data[i].telescopeid,
        name: data[i].telescopename,
        type: data[i].telescopetype,
        city: data[i].city,
        country: data[i].country
      })
    }
    return newdata
  } catch (err) {
    throw err
  }
}

async function telescopeByID (id) {
  if (!id || !(typeof id === 'number')) {
    throw new Error('Bad id')
  }
  try {
    var data = await db.func('TelescopeByID', id)
    var newdata = []
    for (var i = 0; i < data.length; i++) {
      newdata.push({
        id: data[0].telescopeid,
        name: data[0].telescopename,
        type: data[0].telescopetype,
        city: data[0].city,
        country: data[0].country
      })
    }
    return newdata
  } catch (err) {
    throw err
  }
}

async function createTelescope (name, type, telinfo, telcity, telcountry) {
  try {
    await db.func('CreateTelescope', [name, type, telinfo, telcity, telcountry])
  } catch (err) {
    throw err
  }
}

async function changeTelescope (id, name, type, telinfo, telcity, telcountry) {
  try {
    await db.func('ChangeTelescope', [id, name, type, telinfo, telcity, telcountry])
  } catch (err) {
    throw err
  }
}

async function deleteTelescopeByID (id) {
  try {
    var data = await db.func('DeleteTelescopeByID', id)
    var newdata = []
    for (var i = 0; i < data.length; i++) {
      newdata.push({
        id: data[i].telescopeid,
        name: data[i].telescopename,
        type: data[i].telescopetype,
        city: data[i].city,
        country: data[i].country
      })
    }
    return newdata
  } catch (err) {
    throw err
  }
}

module.exports = {
  telescopes: telescopes,
  sortTelescopes: sortTelescopes,
  searchTelescopes: searchTelescopes,
  telescopeByID: telescopeByID,
  createTelescope: createTelescope,
  changeTelescope: changeTelescope,
  deleteTelescopeByID: deleteTelescopeByID
}
