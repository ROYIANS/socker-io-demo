const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const axios = require("axios");

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  let userID = '', userColor = parseInt(Math.random() * 16777216).toString(16);
  socket.on('join', function (userName) {
    userID = userName;
    io.emit('sys', userID + ': 已加入房间');
    console.log(userID + ': 加入了');
  });
  socket.on('disconnect', () => {
    console.log(`一个连接已销毁: ${userID}离开了`);
    io.emit('sys', `${userID}离开了`);
  });
  socket.on('message', (msg) => {
    console.log(`${userID}:${msg}`)
    io.emit('msg', userID, userColor, msg);
  });
});

http.listen(3000, () => {
  console.log('监听端口：3000');
});