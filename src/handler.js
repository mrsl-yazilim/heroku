const { validationResult } = require('express-validator');
const { ImageFileuploadValidationResult } = require('./validator')

class Handler {
    constructor(manager) {
        this.manager = manager
    }

    async sendMessages(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { _id, message, numbers } = req.body

        const client = this.manager.getClient(_id)
        if (client.isDestroyed) {
            this.manager.destroyClient(_id)
            return res.status(500).json({ message: `client is disconnected` })
        }
        if (!client.isReady) {
            return res.status(500).json({ message: `client is not ready. please, wait for a minute` })
        }
        for (let i = 0; i < numbers.length; i++) {
            const num = `${numbers[i]}@c.us`;

            let numberRegisteredWA = await client.isRegisteredUser(num)
            if (numberRegisteredWA) {
                client.sendMessage(num, message)
            }
        }
        res.status(200).json({
            message: `called`
        });
    }

    async sendMedia(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const fileErrors = new ImageFileuploadValidationResult(req)
        if (!fileErrors.isEmpty()) {
            return res.status(400).json({ errors: fileErrors.array() });
        }

        const { _id, caption, numbers } = req.body

        const file = req.files.file


        const client = this.manager.getClient(_id)
        if (client.isDestroyed) {
            this.manager.destroyClient(_id)
            return res.status(500).json({ message: `client is disconnected` })
        }
        if (!client.isReady) {
            return res.status(500).json({ message: `client is not ready. please, wait for a minute` })
        }
        for (let i = 0; i < numbers.length; i++) {
            const num = `${numbers[i]}@c.us`;

            let numberRegisteredWA = await client.isRegisteredUser(num)
            if (!numberRegisteredWA) {
                client.sendMedia(num, file, caption)
            }
        }
        res.status(200).json({
            message: `called`
        });
    }
}
module.exports = Handler