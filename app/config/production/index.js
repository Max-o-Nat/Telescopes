const fetch = require('isomorphic-fetch')

const config = {
  db: {
    connectionString: process.env.DATABASE_URL
  },
  dbx: {
    fetch: fetch,
    accessToken: 'QS-zrKwIidAAAAAAAAAACQC6_-eIelY_PwxXT7QLKXfFkyYYxBp2sppSOHGPottO'
  },
  port: 3000,
  astrophoto: '/public/images/astrophoto/',
  userphoto: '/public/images/userphoto/',
  defaultuseravatar: '/public/images/userphoto/defaultuseravatar.png',
  secret: 'pl,okmijnuhbygvtfcr'
}

module.exports = config
