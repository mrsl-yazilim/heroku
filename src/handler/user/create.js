
module.exports = async (req, res, next) => {
    const { user, password, number } = req.body

    const { UserModel } = req.db
    // manual unique
    if (await UserModel.findOne({ number })) {
        const err = new Error(`user with number ${number} is already exist`)
        err.code = 400
        return next(err)
    }
    // manual unique end

    const bcrypt = req.bcrypt
    // eslint-disable-next-line no-undef
    const hashed = await bcrypt.hash(password, Number(process.env.SALT_OR_ROUNDS))

    await UserModel.createUser({ user, password: hashed, number })
        .then(resultUser => res.status(201).json({
            message: `successfully created user`,
            data: {
                user: resultUser.user,
                number: resultUser.number
            }
        }))
        .catch(err => next(err))

}