const { validationResult } = require('express-validator');
const { UserModel } = require('../../model/user')

module.exports = async (req, res) => {
    console.log(`push-contact`)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // validation end

    const { user, password, number } = req.body

    const userData = await UserModel.findOne({ user, password, number })

    const { c_name, c_number } = req.body
    const result = await UserModel.pushContact(userData._id, { c_name, c_number })

    res.status(200).json({
        user,
        message: `successfully added contact ${c_name} ${c_number}`,
        result: result
    });
}