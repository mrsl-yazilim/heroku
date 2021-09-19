const { validationResult } = require('express-validator');
const { UserModel } = require('../../model/user')

module.exports = async (req, res) => {
    console.log(`user-delete`)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // validation end

    const { user, password, number } = req.body

    if (!await UserModel.findOne({ number })) {
        return res.status(404).json({ message: `user with number ${number} not found` });
    }

    await UserModel.deleteOne({ user, password, number })


    res.status(200).json({
        message: `successfully deleted user`,
    });
}