const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SessionModel = mongoose.model('Session', new Schema(
    {
        // session: Object
        // session: Schema.Types.Mixed
        session: {
            WABrowserId: String,
            WASecretBundle: String,
            WAToken1: String,
            WAToken2: String
        }
    },
))

/**
 * 
 * @param {string} _id 
 * @returns sessionData
 */
SessionModel.findSession = async function (_id) {
    let sessionData = null
    if (_id) {
        console.log(`find session`)
        sessionData = await SessionModel.findOne({ _id })
    }
    return sessionData
}



module.exports = { SessionModel }