const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserModel = mongoose.model('User', new Schema(
    {
        user: {
            type: String,
            required: [true, 'user is required'],
            unique: [true, 'user already exist'],
            dropDups: true
        },
        password: {
            type: String,
            required: [true, 'password is required'],
        },
        number: {
            type: String,
            required: [true, 'number is required'],
            unique: [true, 'number already exist'],
            dropDups: true
        },   // phone number
        contacts: [
            {
                c_name: String,
                c_number: {
                    type: String,
                    unique: [true, 'c_number already exist'],
                    dropDups: true
                },
                // pushname: String,
                // shortName: String,
                // verifiedName: String
            }
        ]

    },
))

/**
 * 
 * @param {string} _id 
 * @param {object} contact 
 * @returns 
 */
UserModel.pushContact = async (_id, contact) => {
    return await UserModel.updateOne({ _id }, {
        $addToSet: { contacts: contact }
    })
    // return await UserModel.findByIdAndUpdate(_id, {
    //     $addToSet: { contacts: contact }
    // })
}



module.exports = { UserModel }