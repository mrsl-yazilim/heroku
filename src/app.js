const express = require('express')
require('./db')
const { SessionModel } = require('./model')
const { ClientWaweb, ManagerWaweb } = require('./client-waweb')
const Handler = require('./handler')
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const process = require('process')
const { validateReqSendMessages, validateReqSendMedia } = require('./validator')
const fileUpload = require('express-fileupload');


const app = express()
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    credentials: true
  },
  allowEIO3: true // false by default
});
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload())
app.use(cors({ credentials: true, origin: '*' }));

let manager = new ManagerWaweb()

io.on('connection', function (socket) {
  socket.emit('message', 'Connecting...');

  socket.on('create-session', async (data) => {
    socket.emit('log', 'create-sessio...?');

    const session = await SessionModel.findOne(data)
    console.log(session)
    const clientWaweb = new ClientWaweb({ user: data.user, session: session })
    clientWaweb.setEmitter(socket)

    manager.pushClient(clientWaweb)
    socket.emit('log', 'create-sessio...!!!!');
  })

});




app.get('/', (req, res) => {
  res.status(200).json({
    message: `see?`
  });
})


const handler = new Handler(manager)

app.post('/api/send-messages', validateReqSendMessages, (req, res) => handler.sendMessages(req, res))
app.post('/api/send-media', validateReqSendMedia, (req, res) => handler.sendMedia(req, res))
// app.post('/api/client', validateReqSendMedia, (req, res) => handler.sendMedia(req, res))



let port = process.env.PORT || 5555
server.listen(port, function () {
  console.log('App running on *: ' + port);
});