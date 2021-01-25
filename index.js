const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const axios = require("axios");

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('一个连接已建立');
  socket.on('disconnect', () => {
    console.log('一个连接已销毁');
  });
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    axios
      .get("https://v1.hitokoto.cn/")
      .then(res => {
        console.log(res.data.hitokoto);
        socket.emit('hello', res.data.hitokoto);
      })
      .catch(err => {
        console.log(err);
      });
  });
});

http.listen(3000, () => {
  console.log('监听端口：3000');
});