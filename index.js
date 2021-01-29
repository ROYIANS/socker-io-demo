const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const axios = require("axios");
const Avatars = require("@dicebear/avatars");
const sprites = require("@dicebear/avatars-avataaars-sprites");

app.get('/avatar/:user', (req, res) => {
  let options = {
    skin: ['light']
  };
  let avatars = new Avatars.default(sprites.default, options);
  let svg = avatars.create(req.params.user);
  res.header('Content-Type', 'image/svg+xml')
  res.send(svg);
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/reg', (req, res) => {
  res.sendFile(__dirname + '/reg.html');
});

app.get('/css/icon.css', (req, res) => {
  res.sendFile(__dirname + '/css/icon.css');
});
app.get('/css/main.css', (req, res) => {
  res.sendFile(__dirname + '/css/main.css');
});
app.get('/css/Quicksand.css', (req, res) => {
  res.sendFile(__dirname + '/css/Quicksand.css');
});
app.get('/css/reset.min.css', (req, res) => {
  res.sendFile(__dirname + '/css/reset.min.css');
});
app.get('/css/Sniglet.css', (req, res) => {
  res.sendFile(__dirname + '/css/Sniglet.css');
});
app.get('/js/main.js', (req, res) => {
  res.sendFile(__dirname + '/js/main.js');
});
app.get('/js/jquery.min.js', (req, res) => {
  res.sendFile(__dirname + '/js/jquery.min.js');
});
app.get('/js/react-dom.js', (req, res) => {
  res.sendFile(__dirname + '/js/react-dom.js');
});
app.get('/js/react-with-addons.js', (req, res) => {
  res.sendFile(__dirname + '/js/react-with-addons.js');
});
app.get('/js/md5.js', (req, res) => {
  res.sendFile(__dirname + '/js/md5.js');
});
app.get('/scrollbar_arrow.png', (req, res) => {
  res.sendFile(__dirname + '/scrollbar_arrow.png');
});

let typeList = {}

io.on('connection', (socket) => {
  let user = {}
  socket.on('join', function (userStr) {
    user = JSON.parse(userStr);
    io.emit('sys', user.name + ' 进入了房间');
    console.log('\n=SYS=========================');
    console.log(`${user.name} 建立连接`);
    console.log(`UUID: ${user.guid}] 用户注册时间：${user.createTime}`)
    console.log('=============================\n');
  });
  socket.on('disconnect', () => {
    console.log('\n=SYS=========================');
    console.log(`${user.name} 断开连接`);
    console.log('=============================\n');
    typeList[user.name] = false
    io.emit('typing-list', JSON.stringify(typeList));
    io.emit('sys', `${user.name} 离开了`);
  });
  socket.on('message', (msg) => {
    console.log(`[${user.name}](${user.guid.substring(0, 8)}): ${msg}`)
    io.emit('come-msg', JSON.stringify(user), msg);
  });
  socket.on('typing', (writer) => {
    typeList[writer] = true
    io.emit('typing-list', JSON.stringify(typeList));
  });
  socket.on('reset-typing', (writer) => {
    typeList[writer] = false
    io.emit('typing-list', JSON.stringify(typeList));
  });
});

http.listen(3000, () => {
  console.log('开启服务，监听端口：3000');
});