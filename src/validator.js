const { body } = require('express-validator');


const validateReqSendMessages = [
    body(`numbers`, `numbers is empty`).notEmpty(),
    body(`numbers`, `can't convert to array`).toArray(),
    body(`numbers`, `numbers array min length is 1`).isArray({ min: 1 }),
    body(`numbers.*`, `not a mobile phone`).isMobilePhone(),

    body(`message`, `message is empty`).notEmpty()
]
const validateReqSendMedia = [
    body(`numbers`, `numbers is empty`).notEmpty(),
    body(`numbers`, `can't convert to array`).toArray(),
    body(`numbers`, `numbers array min length is 1`).isArray({ min: 1 }),
    body(`numbers.*`, `not a mobile phone`).isMobilePhone(),

    body(`caption`, `caption is empty`).isString(),
    body(`file.mimetype`,`file is not an image`).isMimeType('image/*')
]


module.exports = { validateReqSendMessages, validateReqSendMedia }