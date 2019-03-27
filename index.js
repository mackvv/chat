// Import express and create instance
const express = require('express');
const app = express();
// Create Instance of http server
const http = require('http').Server(app);
const port = 8080; // Port to use for server

const io = require('socket.io')(http);

app.use('/', express.static('public'))

// List of active Users
const users = {};
const idToUsers = {};

// List of avail Rooms
const rooms = ['LOBBY'];

io.on('connection', (socket) => {

  socket.emit('connected');

  socket.on("login", username => {

    if (!users[username]) {
        let userData = {};
        userData['socketID'] = socket.id;
        userData['roomID'] = 'LOBBY';
        users[username] = userData

        idToUsers[socket.id] = username;

        socket.join('LOBBY');
        socket.emit("ROOMS", rooms);
    } else {
      socket.emit("userInUse");
    }
  });

  socket.on("Change Room", room => {
    if(!rooms.includes(room)) {
        rooms.push(room);
        io.emit("ROOMS", rooms);
    }

    let userName = idToUsers[socket.id];
    let userData = users[userName];

    socket.leave(userData['roomID']);
    socket.join(room);
    userData['roomID'] = room;

    users[userName] = userData;
  });

  socket.on("MessageToServer", msg => {
    let dataPacket = {};
    dataPacket['fromUser'] = idToUsers[socket.id];
    dataPacket['msg'] = msg;

    let userName = idToUsers[socket.id];
    let userData = users[userName];

    socket.broadcast.to(userData['roomID']).emit("MessageFromServer", dataPacket);
  });

  socket.on("logout", () => {
    let userName = idToUsers[socket.id];
    delete users[userName];
    delete idToUsers[socket.id];
    socket.disconnet();
  });
});

// Server starts listening
http.listen(port, () => console.log(`App Online`))
