const express = require('express')
require('./db')
const { SessionModel } = require('./model')
const { manager } = require('./client-waweb')
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


io.on('connection', function (socket) {
  socket.emit('message', 'Connecting...');

  socket.on('create-session', async (_id) => {
    socket.emit('log', 'create-session...?');

    let sessionData = null
    socket.emit('log', `send _id: ${_id}`);
    console.log('send _id: ', _id)
    if (_id) {
      console.log(`find session`)
      sessionData = await SessionModel.findOne({ _id })
    }
    console.log('sessionData: ', sessionData)

    manager.createClient(sessionData, socket)
    socket.emit('log', 'created-session...!!!!');
  })

});




app.get('/', (req, res) => {
  res.status(200).json({
    message: `see?`
  });
})


const handler = new Handler(manager)

app.post('/api/send-message', validateReqSendMessages, (req, res) => handler.sendMessages(req, res))
app.post('/api/send-media', validateReqSendMedia, (req, res) => handler.sendMedia(req, res))


let port = process.env.PORT || 5555
server.listen(port, function () {
  console.log('App running on *: ' + port);
});