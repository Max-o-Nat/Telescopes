const path = require('path')
var Dropbox = require('dropbox').Dropbox

var config = require(path.join(__dirname, '/../config/', (process.env.NODE_ENV || 'development')))

var dbx = new Dropbox(config.dbx)

async function getTemporaryLinks (path) {
  try {
    var result = await dbx.filesGetTemporaryLink({ path: path })
    return result.link
  } catch (err) {
    throw err
  }
}

async function filesListFolder (path) {
  try {
    var result = await dbx.filesListFolder({ path: path })
    return result
  } catch (err) {
    throw err
  }
}

async function upload (file, id) {
  var ops = {
    contents: file.buffer,
    autorename: true,
    mode: { '.tag': 'add' },
    path: config.userphoto + id + '_' + file.originalname
  }
  try {
    var result = await dbx.filesUpload(ops)
    result.name = config.userphoto + id + '_' + file.originalname
    return result
  } catch (err) {
    throw err
  }
}

async function uploadphoto (file, id) {
  var ops = {
    contents: file.buffer,
    autorename: true,
    mode: { '.tag': 'add' },
    path: config.astrophoto + id + '_' + file.originalname
  }
  try {
    var result = await dbx.filesUpload(ops)
    result.name = config.astrophoto + id + '_' + file.originalname
    return result
  } catch (err) {
    throw err
  }
}

async function deletefile (path) {
  try {
    var result = await dbx.filesDelete({ path: path })
    return result
  } catch (err) {
    throw err
  }
}

module.exports = {
  dbx: dbx,
  getLink: getTemporaryLinks,
  listFolder: filesListFolder,
  upload: upload,
  uploadphoto: uploadphoto,
  delete: deletefile
}
