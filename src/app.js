const express = require('express')
const { ClientWaweb } = require('./client-waweb')
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');    




let app = express()
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    handlePreflightRequest: (req, res) => {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "https://example.com",
        "Access-Control-Allow-Methods": "GET,POST",
        "Access-Control-Allow-Headers": "my-custom-header",
        "Access-Control-Allow-Credentials": true
      });
      res.end();
    },
    // allowedHeaders: ["my-custom-header"],
    credentials: true
  },
  allowEIO3: true // false by default
});

let clientWaweb = new ClientWaweb(`1`)
app.use(cors({credentials: true, origin: '*'}));

app.post('/api/send-message', (req, res) => {
  let number = `6283842455250@c.us`
  clientWaweb.sendMessage(number, `world`)
    .then(response => {
      console.log(response)
    })
    .catch(err => {
      console.log(err)
    })
  res.status(200).json({
    message: `called`
  });
})

app.post('/api/send-messages', (req, res) => {
  let numbers = [`6283842455250@c.us`, `6283842455250@c.us`, `6283842455250@c.us`]
  for (let i = 0; i < numbers.length; i++) {
    const num = numbers[i];
    clientWaweb.sendMessage(num, `world${i}`)
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      })
  }
  res.status(200).json({
    message: `called`
  });
})



io.on('connection', function (socket) {
  socket.emit('message', 'Connecting...');

  clientWaweb.setSocket(socket)

});























let port = 5555
server.listen(port, function () {
  console.log('App running on *: ' + port);
});