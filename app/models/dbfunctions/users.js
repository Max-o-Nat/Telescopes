const path = require('path')
const db = require(path.join(__dirname, '/../db.js')).db

async function users () {
  try {
    var data = await db.func('Users')
    return data
  } catch (err) {
    throw err
  }
}

async function sortUsers (sorttype) {
  try {
    var data = await db.func('SortUsers', sorttype)
    return data
  } catch (err) {
    throw err
  }
}

async function searchUsers (searchtype, searchtext) {
  try {
    var data = await db.func('SearchUsers', [searchtype, searchtext])
    return data
  } catch (err) {
    throw err
  }
}

async function userByLogin (username) {
  try {
    var data = await db.func('UserByLogin', username)
    return data
  } catch (err) {
    throw err
  }
}

async function getUserPhotos (userid) {
  try {
    var data = await db.func('GetUserPhotos', parseInt(userid, 10))
    return data
  } catch (err) {
    throw err
  }
}

async function changeAvatar (userid, rname) {
  try {
    await db.func('ChangeAvatar', [userid, rname])
  } catch (err) {
    throw err
  }
}

async function changeUser (userid, username, email, password, info) {
  try {
    await db.func('ChangeUser', [userid, username, email, password, info])
  } catch (err) {
    throw err
  }
}

async function changeRole (id, role) {
  try {
    await db.func('ChangeRole', [parseInt(id, 10), role])
  } catch (err) {
    throw err
  }
}

async function userById (id) {
  try {
    var data = await db.func('UserById', parseInt(id, 10))
    return data
  } catch (err) {
    throw err
  }
}

async function checkUser (username) {
  try {
    var data = await db.func('CheckUsername', username)
    if (data[0].checkusername) { return { msg: 'Такой логин уже существует' } }
  } catch (err) {
    throw err
  }
}

async function checkEmail (email) {
  try {
    var data = await db.func('CheckEmail', email)
    if (data[0].checkemail) { return { msg: 'Такой email уже существует' } }
  } catch (err) {
    throw err
  }
}

async function createUser (email, user, password) {
  try {
    await db.func('CreateUser', [
      email,
      user,
      password
    ])
  } catch (err) {
    throw err
  }
}

module.exports = {
  users: users,
  sortUsers: sortUsers,
  searchUsers: searchUsers,
  userByLogin: userByLogin,
  getUserPhotos: getUserPhotos,
  changeUser: changeUser,
  changeAvatar: changeAvatar,
  changeRole: changeRole,
  userById: userById,
  checkUser: checkUser,
  checkEmail: checkEmail,
  createUser: createUser
}
