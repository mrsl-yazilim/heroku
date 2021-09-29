const express = require('express')

const cors = require('cors');
const fileUpload = require('express-fileupload');


/**
 * these values will be injected to handlers
 * @param {object} db { UserModel, ContactsModel }
 * @param {bcrypt} bcrypt 
 * @returns app
 */
module.exports = (db, bcrypt) => {
  if (!db || !bcrypt) {
    return new Error("provide the dependencies")
  }
  const app = express()

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(fileUpload())
  app.use(cors({ credentials: true, origin: true }));

  // inject db
  app.use((req, res, next) => {
    req.db = db
    req.bcrypt = bcrypt
    next()
  })

  app.get('/', (req, res) => {
    res.status(200).json({
      message: `server up`
    });
  })

  app.use('/api/user', require("./routes/user"))
  app.use('/api/waweb', require("./routes/waweb"))

  app.use(require("./middleware/expressError"))

  return app
}