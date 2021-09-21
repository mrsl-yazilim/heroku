const { UserModel } = require('../../model/user')
const { ContactsModel } = require('../../model/contacts')

module.exports = async (req, res) => {
    console.log(`push-contact`)

    const { user, password, number } = req.body

    const userData = await UserModel.findOne({ user, password, number })

    const { c_name, c_number } = req.body
    const result = await ContactsModel.deleteContact(userData.contacts_id, { c_name, c_number })

    res.status(200).json({
        user,
        message: `successfully deleted contact ${c_name} ${c_number}`,
        result: result
    });
}