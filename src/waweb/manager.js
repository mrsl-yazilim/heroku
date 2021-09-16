const { ClientWaweb } = require('./client')
const Scheduler = require('./scheduler')

class ManagerWaweb {

    constructor() {
        this.clients = []
        Scheduler.destroyClient(this)
    }

    /**
     * @param {*} sessionData 
     * @todo create client
     * @returns client
     */
    createClient(sessionData) {
        return new ClientWaweb(sessionData)
    }

    /**
     * @param {*} clientWaweb 
     * @todo add client
     */
    pushClient(clientWaweb) {
        this.clients.push(clientWaweb)
    }

    // /**
    //  * @param {string} _id
    //  * @todo choose client when send-message
    //  * @returns client
    //  */
    // getClientById(_id) {
    //     for (let i = 0; i < this.clients.length; i++) {
    //         const client = this.clients[i];
    //         if (client._id == null) { continue }
    //         if (client._id.toString() == _id) {
    //             return client
    //         }
    //     }
    // }

    /**
     * 
     * @param {string} user_id can be get from SessionModel
     * @returns 
     */
    getClientByUserID(user_id) {
        for (let i = 0; i < this.clients.length; i++) {
            const client = this.clients[i];
            console.log(client.sessionData.user_id)
            if (client.sessionData.user_id == null) { continue }
            if (client.sessionData.user_id.toString() == user_id) {
                return client
            }
        }
    }




}

const manager = new ManagerWaweb()
module.exports = { manager }
