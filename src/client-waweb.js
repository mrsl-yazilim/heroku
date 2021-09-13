const { Client, MessageMedia } = require('whatsapp-web.js')
const qrcode = require('qrcode')
const { SessionModel } = require('./model')


class WaWebEmitter {
    /**
     * 
     * @param {*} socket 
     * @todo emit event to frontend client
     * 
     */
    constructor(socket) {
        this.socket = socket
    }
    /**
     * 
     * @param {string} eventName 
     * @param {*} data 
     */
    emit(eventName, data) {
        this.socket.emit(`${eventName}`, data);
    }
}

class ManagerWaweb {

    constructor() {
        this.clients = []
    }
    /**
     * 
     * @param {*} clientWaweb 
     * @todo add client
     */
    pushClient(clientWaweb) {
        this.clients.push(clientWaweb)
    }
    /**
     * @param {string} _id
     * @todo choose client when send-message
     * @returns client
     */
    getClient(_id) {
        // for (let i = 0; i < this.clients.length; i++) {
        //     const client = this.clients[i];
        //     if (client._id.toString() == _id) {
        //         return client
        //     }
        // }
        return this.clients.find((client) => client._id.toString() == _id)
    }
    /**
     * 
     * @param {string} _id 
     * @returns client's index
     */
    getClientIndex(_id) {
        return this.clients.findIndex((client) => client._id.toString() == _id)
    }
    /**
     * 
     * @param {String} _id 
     * @todo destroy client
     * @returns client
     */
    destroyClient(_id) {
        return this.clients.splice(this.getClientIndex(_id), 1)
    }




}

class ClientWaweb extends Client {

    constructor(sessionData) {
        super({
            restartOnAuthFail: true,
            puppeteer: {
                // executablePath: `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`,
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process', // <- this one doesn't works in Windows
                    '--disable-gpu'
                ],
            },
            session: sessionData ? sessionData.session : null
        })
        this._id = sessionData ? sessionData._id : null
        this.isReady = false
        this.isDestroyed = false

        this.initialize();
    }

    setEmitter(socket) {
        this.emitter = new WaWebEmitter(socket)
        this._listenAllEvents()
    }

    _listenAllEvents() {
        this.on('qr', (qr) => {
            console.log('QR RECEIVED', qr);
            qrcode.toDataURL(qr, (err, url) => {
                this.emitter.emit('qr', url);
                this.emitter.emit('log', 'QR received');
            });
        });

        this.on('authenticated', async (session) => {
            this.emitter.emit('authenticated', 'Whatsapp is authenticated!');
            this.emitter.emit('log', 'Whatsapp is authenticated!');

            if (this._id == null) {
                const sessionData = new SessionModel({ session })
                await sessionData.save()
                this.emitter.emit('log', `_id: ${sessionData._id}`)
                console.log(sessionData)
            }
            console.log(`AUTHENTICATED`)
        });

        this.on('ready', () => {
            this.isReady = true

            this.emitter.emit('ready', 'Whatsapp is ready!');
            this.emitter.emit('log', 'Whatsapp is ready!');

        });

        this.on('auth_failure', function () {
            this.emitter.emit('auth_failure', 'Auth failure, restarting...');
            this.emitter.emit('log', 'Auth failure, restarting...');
        });

        this.on('disconnected', async (reason) => {
            this.emitter.emit('disconnected', 'Whatsapp is disconnected!');
            this.emitter.emit('log', 'Whatsapp is disconnected!');

            const res = await SessionModel.deleteOne({ _id: this._id })
            console.log('delete sesseion:', res)
            console.log('disconnected:', reason)
            this.destroy();
            this.initialize();

            this.isDestroyed = true
        });
    }
    /**
     * 
     * @param {string} number 
     * @param {string} message 
     * @returns 
     */
    sendMessage(number, message) {
        return super.sendMessage(number, message)
    }
    /**
     * 
     * @param {string} number 
     * @param {*} file 
     * @param {string} caption 
     * @returns 
     */
    sendMedia(number, file, caption) {
        const base64Data = file.data.toString('base64')
        const media = new MessageMedia(file.mimetype, base64Data, file.name)
        return super.sendMessage(number, media, { caption: caption })
    }

}

let manager = new ManagerWaweb()

module.exports = { ClientWaweb, manager }